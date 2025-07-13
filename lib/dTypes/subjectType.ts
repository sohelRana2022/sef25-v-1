type Section = 'মানবিক' | 'বিজ্ঞান' | 'সাধারণ' | string; // অন্য শাখাও যেন যায়

interface SubjectInfo {
  name: string;
  code: string;
}

const SUBJECTS: Record<'মানবিক' | 'বিজ্ঞান' | 'সাধারণ', Record<string, SubjectInfo>> = {
  মানবিক: {
    '101': { name: 'বাংলা ১ম পত্র',  code: '101' },
    '102': { name: 'বাংলা ২য় পত্র',  code: '102' },
    '112': { name: 'বাংলা',  code: '112' },
    '107': { name: 'ইংরেজি ১ম পত্র',  code: '107' },
    '108': { name: 'ইংরেজি ২য় পত্র',  code: '108' },
    '178': { name: 'ইংরেজি',  code: '178' },
    '109': { name: 'সাধারণ গণিত',  code: '109' },
    '111': { name: 'ধর্ম ও নৈতিক শিক্ষা',  code: '111' },
    '154': { name: 'তথ্য ও যোগাযোগ প্রযুক্তি',  code: '154' },
    '150': { name: 'সাধারণ বিজ্ঞান',  code: '127' },
    '136': { name: 'ভূগোল ও পরিবেশ',  code: '110' },
    '137': { name: 'অর্থনীতি',        code: '141' },
    '138': { name: 'ইতিহাস ও বিশ্বসভ্যতা', code: '153' },
    '126': { name: 'কৃষি শিক্ষা',     code: '134' },
  },
  বিজ্ঞান: {
    '101': { name: 'বাংলা ১ম পত্র',  code: '101' },
    '102': { name: 'বাংলা ২য় পত্র',  code: '102' },
    '112': { name: 'বাংলা',  code: '112' },
    '107': { name: 'ইংরেজি ১ম পত্র',  code: '107' },
    '108': { name: 'ইংরেজি ২য় পত্র',  code: '108' },
    '178': { name: 'ইংরেজি',  code: '178' },
    '109': { name: 'সাধারণ গণিত',  code: '109' },
    '111': { name: 'ধর্ম ও নৈতিক শিক্ষা',  code: '111' },
    '154': { name: 'তথ্য ও যোগাযোগ প্রযুক্তি',  code: '154' },
    '150': { name: 'বাংলাদেশ ও বিশ্বপরিচয়',  code: '150' },
    '136': { name: 'পদার্থ বিজ্ঞান',  code: '136' },
    '137': { name: 'রসায়ন বিজ্ঞান',   code: '137' },
    '138': { name: 'জীব বিজ্ঞান',     code: '138' },
    '126': { name: 'উচ্চতর গণিত',     code: '126' },
    '134': { name: 'কৃষি শিক্ষা',     code: '134' },
  },
  সাধারণ: {
    '101': { name: 'বাংলা ১ম পত্র',  code: '101' },
    '102': { name: 'বাংলা ২য় পত্র',  code: '102' },
    '112': { name: 'বাংলা',  code: '112' },
    '107': { name: 'ইংরেজি ১ম পত্র',  code: '107' },
    '108': { name: 'ইংরেজি ২য় পত্র',  code: '108' },
    '178': { name: 'ইংরেজি',  code: '178' },
    '109': { name: 'সাধারণ গণিত',  code: '109' },
    '111': { name: 'ধর্ম ও নৈতিক শিক্ষা',  code: '111' },
    '154': { name: 'তথ্য ও যোগাযোগ প্রযুক্তি',  code: '154' },
    '127': { name: 'সাধারণ বিজ্ঞান',  code: '127' },
    '150': { name: 'বাংলাদেশ ও বিশ্বপরিচয়',  code: '150' },
    '134': { name: 'কৃষি শিক্ষা',     code: '134' },
  },
};

export const getSubjectInfo = (
  section: Section,
  sc: string
): SubjectInfo | null => {
  const sectionSubjects = SUBJECTS[section as 'মানবিক' | 'বিজ্ঞান' | 'সাধারণ'];
  return sectionSubjects?.[sc] ?? null;
};

export const getSubjectName = (
  mark: { sc: string },
  section: Section
): string => {
  const info = getSubjectInfo(section, mark.sc);
  return info ? info.name : 'প্রযোজ্য নয়'; // fallback name
};

export const getSubjectCode = (
  mark: { sc: string },
  section: Section
): string => {
  const info = getSubjectInfo(section, mark.sc);
  return info ? info.code : mark.sc; // fallback code = original code
};
