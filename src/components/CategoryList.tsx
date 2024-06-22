import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';

interface CategoryListProps {
    categories: any[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
    return (
        <div className="mb-6">
            <h1 className="text-xl font-semibold mb-2">Категории</h1>
            <Select placeholder="Выберите категорию" aria-label="Выберите категорию">
                {categories.map(category => (
                    <SelectItem key={category.categoryId} value={category.categoryName}>
                        {category.categoryName}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
};

export default CategoryList;
