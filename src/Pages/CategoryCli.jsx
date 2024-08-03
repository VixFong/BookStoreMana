import React, {useState} from 'react'
import Heading from '../Component/Heading'
import Shop from '../Component/CategoryClient/Shop'
import AIBot from '../Component/AIBot';


export const CategoryCli = () => {
    const [searchKeyword, setSearchKeyword] = useState('');

    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
    };

    return (
        <div>
            <Heading onSearch={handleSearch} />
            <Shop searchKeyword={searchKeyword} />
            <AIBot/>
        </div>
        
    );
};

export default CategoryCli;
