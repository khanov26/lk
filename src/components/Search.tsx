import React, {ChangeEventHandler, useEffect, useState} from 'react';

interface Props {
    onChange: (searchTerm: string) => void;
    defaultValue: string;
}

const Search: React.FC<Props> = ({onChange, defaultValue}) => {
    const [value, setValue] = useState(defaultValue);

    const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
        setValue(event.target.value);
        onChange(event.target.value);
    };

    return (
        <input type="search" value={value} onChange={handleChange}
               className="form-control contact-search" placeholder="Поиск"/>
    );
};

export default React.memo(Search);