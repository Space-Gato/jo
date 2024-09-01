import axios from "axios";
import { useEffect, useState } from "react";

export interface SearchApiProps {
    location?: string,
    revenue?: string,
    price?: string,
    categories?: string,
    keyword: string,
}

export interface SearchApiResponse {
    brands: {
        brandName: string,
        brandLogo: string, //url
        firstProductImg: string, //url
        location: string,
        revenue: string,
        priceRange: string,
        category: string,
    }[],
    solarOutput: string,
}

export interface SearchApiOut {
    loading: boolean,
    error: string | null,
    data: SearchApiResponse | null,
};

function useSearchAPI(props: SearchApiProps): SearchApiOut {
    const [data, setData] = useState<SearchApiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const baseURL = 'https://43.202.147.65:8000';
    const endPoint = '/search';

    useEffect(() => {
        const apiCall = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get<SearchApiResponse>(`${baseURL}${endPoint}`, {params: {...props}});
                setData(response.data);
            } catch {
                setError("serachAPI error");
            } finally {
                setLoading(false);
            }
        };
        apiCall();
    }, [props]);

    return {data, loading, error};
}

export default useSearchAPI;