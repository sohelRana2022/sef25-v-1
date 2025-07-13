export const customOrder = [
  "101", "102", "112", "107", "108", "178", "109", "127", "150", "111", "154", "136",
  "137", "138",  "126", "134"
];

export const relatedClassMap: Record<string, string> = {
    "Six":"ষষ্ঠ",
    "Seven":"সপ্তম",
    "Eight":"অষ্টম",
    "Nine" : "নবম",
    "Ten" : "দশম"
  };
export type SifData = {
  examName: string;
  examYear: string;
  father_name_bn: string;
  mother_name_bn: string;
  stu_name_bn: string;
  stu_id: string;
  stu_class: string;
  section: string;
  stu_gender: string;
  stu_religion: string;
  roll: number;
  mp: number | string;
  gpa: number;
  tm: number;
  sub_4: number;
};

export type MarkData = {
  sc: string;
  cq: number;
  mcq: number;
  prac: number;
  seventy: number;
  twenty: number;
  ten: number;
  total: number;
  gp: number;
};

export type CombinedItem =
  | { type: 'SIF'; data: SifData }
  | { type: 'MARK'; data: MarkData };
