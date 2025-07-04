import { examYear } from './../jsonValue/PickerData';
export type studentDataType = {
    ref_uid:string,
    uid: string,
    stu_name_bn: string,
    stu_name_eng: string,
    stu_class: string,
    stu_gender: string,
    stu_religion: string,
    prev_school: string,
    posibility: number,
    father_name: string,
    mother_name: string,
    contact_1: string,
    contact_2: string,
    address: string,
    village: string,
    ref_person: string,
    sef_branch: string,
    is_admitted : boolean,
    is_active: boolean,
    valid_days: number,
    send_date: string,
    add_point: number,
    commission: number,
    total_add_fee: number
  }
export type summary = {
  ref_uid: string;
  ref_person: string;
  total: number;
  admitted: number;
  posibility100: number;
  total_add: number;
  total_com: number
};

  export type resultDataType = {
    acYear: string,
    examName: string,
    branch: string,
    stuClass: string,
    stuId: number,
    roll: number,
    stuName: string,
    gender: string,
    religion: string,
    section: string,
    fatherName: string,
    motherName: string,
    ref: string,
    bangOne: number,
    bangTwo: number,
    engOne: number,
    engTwo: number,
    math: number,
    sci: number,
    bob: number,
    envIntro: number,
    rel: number,
    gk: number,
    totalMark: number,
    meritPosition: number,
    isActive: string,
    highestMark: {
      BanglaOneHighest: number,
      BanglaTwoHighest: number,
      EngOneHighest: number,
      EngTwoHighest: number,
      MathHighest: number,
      ScienceHighest: number,
      BobHighest: number,
      EnvIntroHighest: number,
      RelHighest: number,
      GkHighest: number,
    }
  }
