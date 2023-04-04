import { NFTUserCollection } from "./serverData";

const serverURL = "https://631b5df3fae3df4dcffcf52e.mockapi.io/api/v1/items";

export async function getPage(pageNumber: number = 1, pageSize: number = 10) {
  const url = `${serverURL}?page=${pageNumber}&limit=${pageSize}`;
  // const url = new URL(serverURL);
  // url.searchParams.set("page", pageNumber.toString());
  // url.searchParams.set("limit", pageSize.toString());

  const response = await fetch(url).catch((e: Error) => e);

  if (response instanceof Error) { // Network errors handling
    console.error("Fetch error:", response);
    return null;
  } else { // No network errors here
    if (response.ok) { // server response status is 200 .. 299
      if (response.headers.get("content-type")?.includes("json")) { // server says that response contains JSON
        const data = (await response.json()) as Array<NFTUserCollection>;
        return data;
      } else { // server says that response NOT JSON
        const data = await response.text();
        // TODO: add errors handler
        // throw new Error('Fetch error: ' + data);
        console.error("Fetch error:", "Unknown data:", data);
        return null;
      }
    } else { // server response status is 400 .. 599 (Client request error or Server error)
      console.error("Fetch error:", "status:", response.status);
      return null;
    }
  }
}
