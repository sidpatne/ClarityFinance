"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Edit, PlusCircle, Save } from 'lucide-react';
import type { Category, CategoryIconName } from '@/types';
import { CATEGORY_ICONS_MAP, CategoryIcon } from '@/components/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryManagerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  categories: Category[];
  onAddCategory: (newCategory: Omit<Category, 'id'>) => void;
  onUpdateCategory: (updatedCategory: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export function CategoryManagerDialog({
  isOpen,
  onOpenChange,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoryManagerDialogProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState<CategoryIconName>('HelpCircle');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const availableIcons = Object.keys(CATEGORY_ICONS_MAP) as CategoryIconName[];

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    onAddCategory({ name: newCategoryName, iconName: newCategoryIcon });
    setNewCategoryName('');
    setNewCategoryIcon('HelpCircle');
  };

  const handleSaveEdit = () => {
    if (editingCategory && editingCategory.name.trim() !== '') {
      onUpdateCategory(editingCategory);
      setEditingCategory(null);
    }
  };
  
  const startEditing = (category: Category) => {
    setEditingCategory({...category}); // Create a copy to edit
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>Add, edit, or delete your expense categories.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-end gap-2">
            <div className="grid flex-1 gap-1.5">
              <Label htmlFor="new-category-name">New Category Name</Label>
              <Input
                id="new-category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Coffee"
              />
            </div>
            <div className="grid gap-1.5">
               <Label htmlFor="new-category-icon">Icon</Label>
                <Select value={newCategoryIcon} onValueChange={(value) => setNewCategoryIcon(value as CategoryIconName)}>
                  <SelectTrigger id="new-category-icon" className="w-[100px]">
                    <SelectValue><CategoryIcon name={newCategoryIcon} className="h-4 w-4" /></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map(icon => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center gap-2">
                         <CategoryIcon name={icon} className="h-4 w-4" /> {icon}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <Button onClick={handleAddCategory} size="icon" variant="outline"><PlusCircle className="h-4 w-4" /></Button>
          </div>

          <Label>Existing Categories</Label>
          <ScrollArea className="h-[200px] w-full rounded-md border p-2">
            {categories.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No categories yet.</p>}
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                {editingCategory?.id === cat.id ? (
                  <div className="flex-1 flex items-end gap-2 mr-2">
                    <Input 
                      value={editingCategory.name} 
                      onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                      className="h-8"
                    />
                     <Select 
                        value={editingCategory.iconName} 
                        onValueChange={(value) => setEditingCategory({...editingCategory, iconName: value as CategoryIconName})}
                      >
                      <SelectTrigger className="w-[60px] h-8 px-2">
                        <SelectValue><CategoryIcon name={editingCategory.iconName} className="h-4 w-4" /></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map(icon => (
                          <SelectItem key={icon} value={icon}><CategoryIcon name={icon} className="h-4 w-4" /></SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleSaveEdit} size="icon" variant="ghost" className="h-8 w-8"><Save className="h-4 w-4 text-primary"/></Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CategoryIcon name={cat.iconName} className="h-5 w-5 text-muted-foreground" />
                    <span>{cat.name}</span>
                  </div>
                )}
                {!editingCategory || editingCategory.id !== cat.id ? (
                <div className="flex gap-1">
                  <Button onClick={() => startEditing(cat)} size="icon" variant="ghost" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                  <Button onClick={() => onDeleteCategory(cat.id)} size="icon" variant="ghost" className="h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
                ) : null}
              </div>
            ))}
          </ScrollArea>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
