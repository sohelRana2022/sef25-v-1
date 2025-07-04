
import { z } from "zod";

// creating a schema for signup form
export const UserInfoSchema = z.object({
  nameBang: z.string().min(1).regex(/^([\u0980-\u09FF]+)( [\u0980-\u09FF]+)*$/,{message:'বাংলায় লিখুন এবং প্রথমে ও শেষে স্পেস দিবেন না!!'}),
  nameEng: z.string().min(1).regex(/^([A-Z][a-z]*)( [A-Z][a-z]*)*$/,{message:'ইংরেজিতে লিখুন এবং প্রথমে ও শেষে স্পেস দিবেন না!'}),
  contact: z.string().regex(/(^(01){1}[3-9]{1}(\d){8})$/,{message:'মোবাইল নাম্বারটি সঠিক নয়!'}),
  role: z.string().min(1),
  title:  z.string().min(1),
  relatedClass: z.string(),
  branch: z.string(),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,{message:'ইমেইলটি সঠিক নয়!'}),
  password: z.string()
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{message:'পাসওয়ার্ডে কমপক্ষে একটি ইংরেজি বড় হাতের অক্ষর, একটি সংখ্যা ও একটি স্পেশাল ক্যারেক্টার থাকতে হবে!'}),
  confirmPassword: z.string()
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{message:'পাসওয়ার্ডে কমপক্ষে একটি ইংরেজি বড় হাতের অক্ষর, একটি সংখ্যা ও একটি স্পেশাল ক্যারেক্টার থাকতে হবে!'}),
}).refine((data) => data.password === data.confirmPassword, {
  message: "পাসওয়ার্ড একই হয়নি!",
  path: ['confirmPassword'], // Field to apply the error message
});
export type UserInfoType = z.infer<typeof UserInfoSchema>


//creating user Schema from server
export const userFromServerSchema = z.object({
    uid: z.string(),
    nameBang: z.string(),
    nameEng: z.string(),
    contact: z.string(),
    title: z.string(),
    role: z.string(),
    branch: z.string(),
    isApproved: z.boolean(),
    imageId: z.string(),
    relatedClass: z.string(),
    email: z.string(),
    password: z.string(),
})
export type UserfromServerType = z.infer<typeof userFromServerSchema>




// creating a schema for login form
export const LoginInfoSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,{message:'ইমেইলটি সঠিক নয়!'}),
  password: z.string().min(1)
})
export type LoginInfoType = z.infer<typeof LoginInfoSchema>



// creating a schema for personal info form

export const primaryContactSchema = z.object({
                    contact_1: z.string()
                    .min(1, {message:'পিতার মোবাইল নাম্বার অবশ্যক!'})
                    .regex(/(^(01){1}[3-9]{1}(\d){8})$/,{message:'মোবাইল নাম্বারটি সঠিক নয়!'})
                    })
export type primaryContactType = z.infer<typeof primaryContactSchema>;




export const PersonalInfoSchemama = z.object({
    stu_name_bn: z.string().trim()
    .nonempty({message:'শিক্ষার্থীর বাংলা পূর্ণনাম অবশ্যই দিতে হবে। '})
    .regex(/^[\u0980-\u09FF\s.]+$/, { message: 'শুধুমাত্র বাংলা অক্ষরে শিক্ষার্থীর নাম লিখতে হবে।' }),
    stu_name_eng: z.string().trim()
    .nonempty({message:'শিক্ষার্থীর ইংরেজি পূর্ণনাম অবশ্যই দিতে হবে। '})
    .regex(/^[A-Za-z\s.]+$/, { message: 'শুধুমাত্র ইংরেজি অক্ষরে শিক্ষার্থীর নাম লিখতে হবে।' })
    .transform(value =>
    value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    ),
    stu_class: z.string().min(1, {message:'এই তথ্যটি বাধ্যতামূলক। '}),
    stu_gender: z.string().min(1, {message:'এই তথ্যটি বাধ্যতামূলক। '}),
    stu_religion: z.string().min(1, {message:'এই তথ্যটি বাধ্যতামূলক। '}),
    prev_school: z.string().trim()
    .nonempty({message:"শিক্ষার্থীর পূর্বের বিদ্যালয়ের নাম অবশ্যই দিতে হবে। প্রি-প্লে ও প্লে শ্রেণীর জন্য 'প্রযোজ্য নয়' লিখতে হবে । "})
    .regex(/^[\u0980-\u09FF\s.,।]+$/, { message: 'শুধুমাত্র বাংলা অক্ষরে শিক্ষার্থীর পূর্বের বিদ্যালয়ের নাম লিখতে হবে।' }),
    posibility: z.string().min(1, {message:'এই তথ্যটি বাধ্যতামূলক। '})
  });

export type PersonalInfoType = z.infer<typeof PersonalInfoSchemama>

// creating a schema for Academic info form
export const ParentsAndContactInfoSchemama = z.object({
  father_name: z.string().trim()
  .nonempty({ message: 'পিতার নাম অবশ্যই প্রদান করতে হবে।' })
  .regex(/^[\u0980-\u09FF\s.]+$/, { message: 'শুধুমাত্র বাংলা অক্ষরে পিতার নাম লিখতে হবে।' }),

  mother_name: z.string().trim()
  .nonempty({message:'মাতার বাংলা পূর্ণনাম অবশ্যক!'})
  .regex(/^[\u0980-\u09FF\s.]+$/, { message: 'শুধুমাত্র বাংলা অক্ষরে মাতার নাম লিখতে হবে।' }),

  contact_2: z.string()
  .min(1, {message:'মাতার মোবাইল নাম্বার অবশ্যক!'})
  .regex(/(^(01){1}[3-9]{1}(\d){8})$/,{message:'মোবাইল নাম্বারটি সঠিক নয়!'}),

  address: z.string().trim()
  .nonempty({message:'বাসার ঠিকানা বিস্তারিত অবশ্যক!'})
  .regex(/^[\u0980-\u09FF\s\-\/\.,]+$/, { message: 'শুধুমাত্র বাংলা অক্ষরে বাসার ঠিকানা বিস্তারিত লিখতে হবে।' }),

  village: z.string({message:'ঠিকানা বাছাই করা আবশ্যক!'})
});

export type ParentsAndContactInfoType = z.infer<typeof ParentsAndContactInfoSchemama>

export const extraDataSchema = z.object({
  ref_uid: z.string(),
  ref_person: z.string(),
  sef_branch: z.string(),
  add_point: z.number().max(1)
})
export type extraDataType = z.infer<typeof extraDataSchema>


export const AdmissionDataSchema = PersonalInfoSchemama.merge(ParentsAndContactInfoSchemama).merge(extraDataSchema);
export type AdmissionDataType = z.infer<typeof AdmissionDataSchema>;

//prev_school
// Individual schema
export const marksEntrySchema = z.object({
  stuClass: z.string(),
  sefBranch: z.string(),
  examName: z.string({message:'আবশ্যকীয় তথ্য!'}),
  stuId: z.coerce.number({message:'আবশ্যকীয় তথ্য!'}),  // Coerce string to number  engOne: z
  bangOne: z.coerce.number().optional()
  .transform((val) => (val === undefined ? 0 : Number(val))) // Convert empty string to null
  .refine((val) => val === null || (typeof val === 'number' && val >= 0 && val <= 100), {
    message: 'নাম্বারটি ভুল!',
  }),
  bangTwo: z.coerce.number().optional()
  .transform((val) => (val === undefined ? 0 : Number(val))) // Convert empty string to null
  .refine((val) => val === null || (typeof val === 'number' && val >= 0 && val <= 50), {
    message: 'নাম্বারটি ভুল!',
  }),
  engOne: z.coerce.number().optional()
  .transform((val) => (val === undefined ? 0 : Number(val))) // Convert empty string to null
  .refine((val) => val === null || (typeof val === 'number' && val >= 0 && val <= 100), {
    message: 'নাম্বারটি ভুল!',
  }),
  engTwo: z.coerce.number().optional()
  .transform((val) => (val === undefined ? 0 : Number(val))) // Convert empty string to null
  .refine((val) => val === null || (typeof val === 'number' && val >= 0 && val <= 50), {
    message: 'নাম্বারটি ভুল!',
  }),
  math: z.coerce.number().optional()
  .transform((val) => (val === undefined ? 0 : Number(val))) // Convert empty string to null
  .refine((val) => val === null || (typeof val === 'number' && val >= 0 && val <= 100), {
    message: 'নাম্বারটি ভুল!',
  }),
  sci: z.coerce.number().optional()
  .transform((val) => (val === undefined ? 0 : Number(val))) // Convert empty string to null
  .refine((val) => val === null || (typeof val === 'number' && val >= 0 && val <= 100), {
    message: 'নাম্বারটি ভুল!',
  }),
  envIntro: z.coerce.number().optional()
  .transform((val) => (val === undefined ? 0 : Number(val))) // Convert empty string to null
  .refine((val) => val === null || (typeof val === 'number' && val >= 0 && val <= 100), {
    message: 'নাম্বারটি ভুল!',
  }),
  bob: z.coerce.number().optional()
  .transform((val) => (val === undefined ? 0 : Number(val))) // Convert empty string to null
  .refine((val) => val === null || (typeof val === 'number' && val >= 0 && val <= 100), {
    message: 'নাম্বারটি ভুল!',
  }),
  rel: z.coerce.number().optional()
  .transform((val) => (val === undefined ? 0 : Number(val))) // Convert empty string to null
  .refine((val) => val === null || (typeof val === 'number' && val >= 0 && val <= 100), {
    message: 'নাম্বারটি ভুল!',
  }),
  gk: z.coerce.number().optional()
  .transform((val) => (val === undefined ? 0 : Number(val))) // Convert empty string to null
  .refine((val) => val === null || (typeof val === 'number' && val >= 0 && val <= 50), {
    message: 'নাম্বারটি ভুল!',
  }),
});

export type marksEntryType = z.infer<typeof marksEntrySchema>;

// Get Result Info schema
export const resultInfoSchema = z.object({
  examName: z.string(),
  stuClass: z.string(),
  examYear: z.string(),
  stuId: z
    .string()
    .regex(/^\d{8}$/, '৮ সংখ্যার আইডি দিন') // Only when provided
    .optional()
    .or(z.literal('')), // Accept empty string
});

export type resultInfoType = z.infer<typeof resultInfoSchema>;

// Get Result Info schema
export const resultInfoSchemaH = z.object({
  studentId: z.string().regex(/(^(\d){8})$/),
  examName: z.string(),
  class: z.string(),
  sefBranch: z.string(),
  examYear: z.string()
});

export type resultInfoTypeH = z.infer<typeof resultInfoSchemaH>;



// Get Mark Info schema
export const subjectMarkSchemaHigh = z.object({
  studentId: z.string().regex(/(^(\d){8})$/),
  roll:z.string(),
  class: z.string(),
  cq: z.number(),
  mcq: z.number(),
  prac: z.number(),

});
export type subjectMarkTypeHigh = z.infer<typeof subjectMarkSchemaHigh>;

// Get Result Info schema
export const getSubjectMarkSchemaHigh = z.object({
  class: z.string(),
  subject: z.string()

});
export type getSubjectMarkTypeHigh = z.infer<typeof getSubjectMarkSchemaHigh>;

//send marks classwise schema
export const markSchema = z.object({
  marks: z.array(
    z.object({
      stuId: z.string(),
      roll: z.number(),
      stuName: z.string(),
      cq: z
        .string()
        .refine(val => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 70, {
          message: 'CQ must be a number between 0 and 70',
        }),
      mcq: z
        .string()
        .refine(val => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 30, {
          message: 'MCQ must be a number between 0 and 30',
        }),
      prac: z
        .string()
        .optional()
        .refine(val => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 25, {
          message: 'MCQ must be a number between 0 and 25',
        })
    })
  )
});

export type markData = z.infer<typeof markSchema>;


export const addInfoSchema = z.object({
  total_add_fee: z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() === '') return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number({ required_error: "সর্বমোট ভর্তি-ফি প্রয়োজন" }).min(1, "সর্বমোট ভর্তি-ফি অবশ্যই ১ বা তার বেশি হতে হবে")),

  add_point: z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() === '') return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number({ required_error: "অবদান সংখ্যা প্রয়োজন" }).min(1, "অবদান সংখ্যা অবশ্যই ১ বা তার বেশি হতে হবে")),

  commission: z.number(),
  is_admitted: z.boolean(),
  add_date: z.date()
});


export type addInfoType = z.infer<typeof addInfoSchema>;
