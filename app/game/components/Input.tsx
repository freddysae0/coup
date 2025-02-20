import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import React, { FC, ChangeEvent, useState } from 'react';

interface InputProps {
    label: string;
    placeholder?: string;
    value: string;
    handleSubmit: () => void;
    setValue: (value: string) => void;
}

const InputComponent: FC<InputProps> = ({ label, placeholder, value, setValue, handleSubmit }) => {


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setValue(newValue);

    };
    const preventDefault = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSubmit();
    };

    return (
        <form onSubmit={preventDefault} className="flex gap-2">
            <Input className="mb-3" value={value} color="default" onChange={handleChange}></Input>
            <Button color="primary" variant="flat">
                Update
            </Button>
        </form>
    );
};

export default InputComponent;