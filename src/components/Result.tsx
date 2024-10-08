import { ReactElement } from "react";
import useInput, { InputState } from "../tools/useInput";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import useContractAPI, { ContractApiOut } from "../api/useContractAPI";
import { SearchApiResponse } from "../api/useSearchAPI";

//design: https://v0.dev/r/prIHE5fgaNv

interface SearchBarProps {
    solarOutput: string,
}

interface CardsProps {
    data: CardProps[],
}

export interface CardProps {
    brandName: string,
    brandLogo: string, //url
    firstProductImg: string, //url
    location: string,
    revenue: string,
    priceRange: string,
    category: string,
}

function Card(props: CardProps): ReactElement {
    const cleandLogo = props.brandLogo.replace(/"/g, '');
    const cleandFirstImg = props.firstProductImg.replace(/"/g, '');
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <img 
                src={cleandLogo} 
                alt={cleandLogo} 
                className="w-full h-32 object-cover rounded-md mb-4" 
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">{props.brandName}</h3>
            <p className="text-gray-600 mb-2">{props.location}</p>
            <p className="text-gray-600 mb-2">Revenue: {props.revenue}</p>
            <p className="text-gray-600 mb-2">Price Range: {props.priceRange}</p>
            <p className="text-gray-600 mb-4">Category: {props.category}</p>
            <img 
                src={cleandFirstImg} 
                alt={cleandFirstImg} 
                className="w-full h-80 object-cover rounded-md mb-4" 
            />
            <Link to={`/order/${props.brandName}`} className="w-full">
                <button className="flex items-center justify-center bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-100 transition duration-300">
                    <FaShoppingCart size={20} color="black" />
                    <span className="ml-2">Add to Cart</span>
                </button>
            </Link>
        </div>
    );
}

function Cards({ data }: CardsProps): ReactElement {
    return (
        <div 
            className="grid gap-6" 
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}
        >
            {data
                .map((cardData: CardProps, index: number): ReactElement => (
                    <Card key={index} {...cardData} />
                ))}
        </div>
    );
}

function SearchBar({ solarOutput }: SearchBarProps): ReactElement {
    const searchState: InputState = useInput("");
    const navigate = useNavigate();
    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            if (searchState.state.length == 0) {
                alert("검색어를 입력해주세요.");
                return;
            }
            navigate('/loading-page', {
                state: {
                    keyword: searchState.state,
                    location: "",
                    revenue: "",
                    price: "",
                    categories: ""
                }
            });
        }
    }
    return (
        <div className="mb-4">
            <input
                placeholder="Search for brands..."
                onChange={searchState.handler}
                onKeyDown={handleKey}
                className="w-full p-4 mb-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-lg font-normal text-gray-400">
                {solarOutput}
            </p>
        </div>
    );
}

function Result(): ReactElement {
    const location = useLocation();
    const data: SearchApiResponse = location.state!;

    return (
        <div className="mt-10 mb-10 ml-20 mr-20 p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Fashion Brand Search</h1>
            <SearchBar solarOutput={data.solarOutput} />
            <Cards data={data.brands} />
        </div>
    );
}

export default Result;
