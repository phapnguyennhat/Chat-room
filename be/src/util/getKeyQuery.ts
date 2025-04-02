import { SearchParams } from "src/common/searchParams";

export function genKeyQuery(query: SearchParams) {
    const sortedQuery = Object.keys(query)
    .sort() // Sắp xếp key theo thứ tự alphabet
    .map((key) => `${key}=${query[key]}`)
      .join('&'); // Tạo lại chuỗi query string
    return sortedQuery
  }