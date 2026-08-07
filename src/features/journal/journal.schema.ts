import { z } from "zod";

// 주식 일지 폼 스키마
export const JOURNAL_SCHEMA = z.object({
  stockCode: z.string().min(1, { message: "종목을 선택해주세요." }),
  stockName: z.string().min(1, { message: "종목(명)을 선택해주세요." }),
  market: z.string().min(1, { message: "종목(시장)을 선택해주세요." }),
  sector: z.string().min(1, { message: "종목(업종)을 선택해주세요." }),
  tradeType: z.string().min(1, { message: "거래 유형을 선택해주세요." }),
  tradeDate: z.string()
    .min(1, { message: "거래일을 선택해주세요." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "거래일자는 YYYY-MM-DD 형식이어야 합니다." }),
  tradeTime: z.string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, { message: "거래시간은 HH:MM:SS 형식이어야 합니다." })
    .or(z.literal("")),
  price: z.preprocess(
    (value) => (value === "" ? undefined : Number(value)),
    z.number({ message: "거래 가격을 입력해주세요." })
      .min(1, { message: "거래 가격은 1 이상이어야 합니다." })
  ),
  quantity: z.preprocess(
    (value) => (value === "" ? undefined : Number(value)),
    z.number({ message: "거래 수량을 입력해주세요." })
      .int({ message: "거래 수량은 정수여야 합니다." })
      .min(1, { message: "거래 수량은 1 이상이어야 합니다." })
  ),
  memo: z.string().optional(),
});

export type JOURNAL_SCHEMA_TYPE = z.input<typeof JOURNAL_SCHEMA>;