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
