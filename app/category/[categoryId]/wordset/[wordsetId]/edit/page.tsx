'use client'

import { useEffect, useState } from 'react'
import { Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function EditPage({
  params,
}: {
  params: { categoryId: string; wordsetId: string };
}) {
  const [strings, setStrings] = useState<string[]>([""])
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  const handleChange = (index: number, value: string) => {
    const newStrings = [...strings]
    newStrings[index] = value
    setStrings(newStrings)
  }

  const handleDelete = () => {
    if (deleteIndex !== null) {
      setStrings(strings.filter((_, i) => i !== deleteIndex))
      setDeleteIndex(null)
    }
  }

  const handleAdd = () => {
    setStrings([...strings, ''])
  }

  const handleSave = () => {
    // Here you would typically send the data to a server or perform some other action
    console.log('Saving strings:', strings)
    alert('Changes saved successfully!')
  }
  
  const fetchWords = async () => {
    try {
      const response = await fetch(
        `/api/categories/${params.categoryId}/wordset/${params.wordsetId}`,
        {
          method: "GET",
          cache: "no-cache",
        },
      );

      if (!response.ok) throw new Error("Failed to fetch words");

      const data = await response.json();
      console.log(data)

      setStrings(data.map((val :any) => val.word))
    } catch (error) {
      console.error("Error fetching words:", error);
      return false;
    }
  };

  useEffect(( ) => {
    fetchWords();
  }, [])

  return (
    <div className="max-w-md mx-auto p-6 px-20 space-y-4">
      <h1 className="text-2xl font-bold text-center mb-10">セット編集</h1>
      {strings.map((str, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            type="text"
            value={str}
            onChange={(e) => handleChange(index, e.target.value)}
            className="flex-grow"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setDeleteIndex(index)}
                aria-label="Delete item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the item.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteIndex(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
      <Button onClick={handleAdd} className="w-full">
        追加
      </Button>
      <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700">
        <Save className="mr-2 h-4 w-4" /> 保存
      </Button>
    </div>
  )
}