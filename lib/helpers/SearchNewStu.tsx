import {StudentInfo} from '../dTypes/StudentDataType';

export const searchNewStudents = (
  data: StudentInfo[],
  searchText: string,
): StudentInfo[] => {
  if (!Array.isArray(data)) return [];

  const searchWords = searchText
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (searchWords.length === 0) {
    return data;
  }

  return data.filter(item => {
    const searchableFields = [
      item.stu_name_bn,
      item.stu_name_eng,
      item.stu_class,

      item.father_name,
      item.mother_name,

      item.contact_1,
      item.contact_2,

      item.address,
      item.village,

      item.ref_person,
      item.ref_uid,

      item.sef_branch,
      item.prev_school,
      item.uid,

      // Boolean
      item.is_admitted ? 'true' : 'false',
      item.is_admitted ? 'admitted' : 'not admitted',
    ]
      .filter(value => value !== null && value !== undefined)
      .map(value => String(value).toLowerCase());

    return searchWords.every(word =>
      searchableFields.some(field => field.includes(word)),
    );
  });
};
