export const getBranches = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/branches`);
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getSchoolDaysByClass = async (idClass: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/school-days/${idClass}`
    );
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
