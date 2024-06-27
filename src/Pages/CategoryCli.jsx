import React, {useState} from 'react'
import Heading from '../Component/Heading'
import Shop from '../Component/CategoryClient/Shop'

export const CategoryCli = () => {
    const [searchKeyword, setSearchKeyword] = useState('');

    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
    };

    return (
        <div>
            <Heading onSearch={handleSearch} />
            <Shop searchKeyword={searchKeyword} />
        </div>
    );
};

export default CategoryCli;
