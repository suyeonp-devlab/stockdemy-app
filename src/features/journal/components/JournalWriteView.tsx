"use client";

import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useGetStockListQuery } from "@/features/stock/stock.query";
import { Stock, StockRequest } from "@/features/stock/stock.type";
import {
  useCreateJournalMutation,
  useGetJournalQuery,
  useRequestAiReviewMutation,
  useUpdateJournalMutation,
} from "@/features/journal/journal.query";
import { CreateJournalRequest, UpdateJournalRequest } from "@/features/journal/journal.type";
import { formatNumber } from "@/shared/utils/number";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JOURNAL_SCHEMA, JOURNAL_SCHEMA_TYPE } from "@/features/journal/journal.schema";
import { getToday } from "@/shared/utils/date-time";
import { useOverlay } from "@/system/overlay/useOverlay";
import JournalWriteSkeleton from "@/features/journal/skeleton/JournalWriteSkeleton";
import Input from "@/shared/components/form/Input";
import IconButton from "@/shared/components/button/IconButton";
import StockAutocomplete from "@/features/journal/components/StockAutocomplete";
import FormField from "@/shared/components/form/FormField";
import ToggleButton from "@/shared/components/button/ToggleButton";
import Textarea from "@/shared/components/form/Textarea";
import Button from "@/shared/components/button/Button";

const SEARCH_COUNT = 5;

type DateMode = "DATE" | "DATE_TIME";

interface JournalWriteViewProps {
  editId: string | null;
  onDone: (keepSearchQuery: boolean) => void;
}

export default function JournalWriteView({ editId, onDone }: JournalWriteViewProps) {

  const { alert, confirm } = useOverlay();

  const { register, handleSubmit, setValue, setValues, getValues, setError, control, trigger, formState: { errors, isSubmitting } } = useForm<JOURNAL_SCHEMA_TYPE>({
    resolver: zodResolver(JOURNAL_SCHEMA),
    mode: "onSubmit",
    defaultValues: {
      stockCode: "", stockName: "", market: "", sector: "", tradeType: "BUY",
      tradeDate: getToday("yyyy-MM-dd"), tradeTime: getToday("HH:mm:ss"), price: "", quantity: "", memo: ""
    },
  });

  const [stockCode, stockName, tradeType, price, quantity] = useWatch({
    control, name: ["stockCode", "stockName", "tradeType", "price", "quantity"]
  });

  // 거래일 입력 유형
  const [dateMode, setDateMode] = useState<DateMode>("DATE");

  // 종목명 검색어
  const [keywordInput, setKeywordInput] = useState("");
  const debouncedKeyword = useDebounce(keywordInput.trim(), 300);

  // 종목 조회
  const stockQuery: StockRequest = {
    market: "", sector: "", keyword: debouncedKeyword,
    favorite: false, topVolume: false, page: 1, pageSize: SEARCH_COUNT,
  };

  const { data: stockResponse, isLoading: isStockLoading } = useGetStockListQuery(debouncedKeyword ? stockQuery : null);
  const stockList = stockResponse?.items ?? [];

  // 종목 선택
  const handleSelectStock = async (stock: Stock) => {

    const values = getValues();

    setValues({
      ...values,
      stockCode: stock.stockCode,
      stockName: stock.stockName,
      market: stock.market,
      sector: stock.sector,
      price: stock.price,
    });

    await trigger(["stockCode", "stockName", "market", "sector", "price"]);
    setKeywordInput("");
  };

  // 종목 선택 취소
  const handleCancelStock = async () => {
    const values = getValues();
    setValues({ ...values, stockCode: "", stockName: "", market: "", sector: "", price: "" });
  };

  // 수정 주식 일지 조회
  const { data: editingJournal, isLoading: isEditLoading } = useGetJournalQuery(editId);

  // 수정 주식 일지 → 폼에 맵핑
  useEffect(() => {
    if (!editingJournal) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDateMode(editingJournal.tradeTime ? "DATE_TIME" : "DATE");

    const values = getValues();

    setValues({
      ...values,
      stockCode: editingJournal.stockCode,
      stockName: editingJournal.stockName,
      market: editingJournal.market,
      sector: editingJournal.sector,
      tradeType: editingJournal.tradeType,
      tradeDate: editingJournal.tradeDate,
      tradeTime: editingJournal.tradeTime ?? "",
      price: editingJournal.price,
      quantity: editingJournal.quantity,
      memo: editingJournal.memo ?? ""
    });
  }, [editingJournal, getValues, setValues]);

  const { mutateAsync: createJournal } = useCreateJournalMutation();
  const { mutateAsync: updateJournal } = useUpdateJournalMutation();
  const { mutateAsync: requestAiReview, isPending: isRequestAiReviewPending } = useRequestAiReviewMutation();

  // 저장 및 수정
  const handleSave = (data: JOURNAL_SCHEMA_TYPE) => {

    // 추가 유효성 검사
    if (dateMode === "DATE_TIME" && !data.tradeTime) {
      setError("tradeTime", { type: "manual", message: "거래시간을 선택해주세요." });
      return;
    }

    const tradeTime = dateMode === "DATE" ? null : data.tradeTime;
    const price = Number(data.price);
    const quantity = Number(data.quantity);
    const memo = data.memo ?? "";

    const payload: CreateJournalRequest = { ...data, tradeTime, price, quantity, memo };
    return editId ? handleUpdate({ ...payload, id: editId }) : handleCreate(payload);
  };

  // 저장
  const handleCreate = async (payload: CreateJournalRequest) => {
    await createJournal(payload);
    await alert("주식 일지가 등록되었습니다.");
    onDone(false);
  };

  // 수정
  const handleUpdate = async (payload: UpdateJournalRequest) => {
    await updateJournal(payload);
    await alert("주식 일지가 수정되었습니다.");
    onDone(true);
  };

  // AI 복기 요청
  const handleRequestAiReview = async () => {

    if (!editId) return;

    const confirmed = await confirm("저장하지 않은 변경 내용은\nAI 복기 분석에 반영되지 않습니다.\n분석을 요청하시겠습니까?");
    if (!confirmed) return;

    await requestAiReview(editId);
    await alert("AI 복기 분석 요청이 접수되었습니다.");
    onDone(false);
  };

  // 조회중 (수정 주식 일지)
  if (editId && isEditLoading) return <JournalWriteSkeleton />

  return (
    <form onSubmit={handleSubmit(handleSave)} noValidate className="max-w-2xl space-y-6 mx-auto">
      <FormField label="종목" error={errors.stockCode?.message} className="mb-4 mt-10">
        {/* 종목 선택 후 */}
        {stockCode && (
          <div className="relative flex justify-between px-4 py-3 rounded-md border bg-gray-800 border-blue-400">
            <div className="text-sm font-semibold">
              <span className="text-gray-500 mr-1.5">[{stockCode}]</span>
              <span className="text-gray-100">{stockName}</span>
            </div>
            <IconButton
              icon={<X size={20} />}
              size="sm"
              onClick={handleCancelStock}
              aria-label="취소"
              className="absolute top-2 right-3 text-gray-500"
            />
          </div>
        )}

        {/* 종목 선택 전 */}
        {!stockCode && (
          <div className="relative">
            <Input
              type="text"
              placeholder="종목명 또는 티커로 검색"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              className="pr-9 py-2 w-full"
              error={!!errors.stockCode}
            />
            <IconButton
              icon={<Search size={20} />}
              size="sm"
              aria-label="검색"
              className="absolute top-2.5 right-3 text-gray-500"
            />
            {debouncedKeyword !== "" && (
              <StockAutocomplete
                isLoading={isStockLoading}
                stockList={stockList}
                onSelect={handleSelectStock}
              />
            )}
          </div>
        )}
      </FormField>

      <FormField label="거래 유형" error={errors.tradeType?.message} className="mb-4 mt-5 pt-5 border-t border-gray-800">
        <div className="flex gap-2 md:gap-4">
          <ToggleButton selected={tradeType === "BUY"} selectedColor="red" onClick={() => setValue("tradeType", "BUY")}>
            매수
          </ToggleButton>
          <ToggleButton selected={tradeType === "SELL"} selectedColor="blue" onClick={() => setValue("tradeType", "SELL")}>
            매도
          </ToggleButton>
        </div>
      </FormField>

      <FormField label="거래일" error={errors.tradeDate?.message || errors.tradeTime?.message} className="mb-4 mt-5 pt-5 border-t border-gray-800">
        <div className="flex gap-2">
          <ToggleButton selected={dateMode === "DATE"} size="sm" onClick={() => setDateMode("DATE")}>
            날짜만
          </ToggleButton>
          <ToggleButton selected={dateMode === "DATE_TIME"} size="sm" onClick={() => setDateMode("DATE_TIME")}>
            날짜+시간
          </ToggleButton>
        </div>

        <div className="mt-2.5 flex flex-col md:flex-row gap-2.5">
          <Input type="date" {...register("tradeDate")} error={!!errors.tradeDate} />
          {dateMode === "DATE_TIME" && <Input type="time" step="1" {...register("tradeTime")} error={!!errors.tradeTime} />}
        </div>
      </FormField>

      <div className="flex gap-2 md:gap-4 mb-4 mt-5 pt-5 border-t border-gray-800">
        <FormField label="거래 가격" error={errors.price?.message} className="flex-1">
          <Input
            type="text"
            placeholder="숫자만 입력"
            error={!!errors.price}
            value={formatNumber(price as string)}
            onChange={(e) => {
              setValue("price", e.target.value.replace(/,/g, ""), { shouldValidate: true });
            }}
          />
        </FormField>

        <FormField label="수량 (주)" error={errors.quantity?.message} className="flex-1">
          <Input
            type="text"
            placeholder="숫자만 입력"
            error={!!errors.quantity}
            value={formatNumber(quantity as string)}
            onChange={(e) => {
              setValue("quantity", e.target.value.replace(/,/g, ""), { shouldValidate: true });
            }}
          />
        </FormField>
      </div>

      <FormField label="메모" error={errors.memo?.message} className="mb-4 mt-5 pt-5 border-t border-gray-800">
        <Textarea
          rows={5}
          placeholder={"판단 근거, 당시 뉴스, 매매 전략 등 거래에 대한 내용을 자유롭게 기록해보세요.\nAI 복기 분석 시 참고 자료로 활용됩니다."}
          {...register("memo")}
          error={!!errors.memo}
        />
        <p className="text-xs md:text-sm text-gray-500 mt-2">메모가 구체적일수록 AI 복기 분석의 정확도가 높아집니다.</p>
      </FormField>

      <div className="flex flex-col gap-3 border-t border-gray-800 pt-6">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <Button type="submit" disabled={isSubmitting} variant="primary" width="full">
            {editId ? "일지 수정하기" : "일지 저장하기"}
          </Button>

          {editId && (
            <Button type="button" disabled={isRequestAiReviewPending} variant="secondary" width="full" onClick={handleRequestAiReview}>
              AI 복기 분석 요청
            </Button>
          )}
        </div>

        <Button type="button" variant="secondary" width="full" onClick={() => onDone(true)}>
          취소
        </Button>
      </div>
    </form>
  );
}
