import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer)
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    if (!data.length) {
      return NextResponse.json(
        { error: 'Empty spreadsheet' },
        { status: 400 }
      )
    }

    // Find required columns
    const headers = data[0] as string[]
    const schoolIndex = headers.findIndex(header => header.trim() === '学校')
    const nameIndex = headers.findIndex(header => header.trim() === '学生姓名')

    if (schoolIndex === -1 || nameIndex === -1) {
      return NextResponse.json(
        { error: 'Required columns not found. Need both "学校" and "学生姓名" columns.' },
        { status: 400 }
      )
    }

    // Verify no extra columns exist
    if (headers.length > 2) {
      return NextResponse.json(
        { error: 'Table contains extra columns. Only "学校" and "学生姓名" are allowed.' },
        { status: 400 }
      )
    }

    // Process rows
    const result = []
    for (let i = 1; i < data.length; i++) {
      const row = data[i] as any[]
      if (row[schoolIndex] && row[nameIndex]) {
        result.push({
          schoolName: row[schoolIndex],
          userName: row[nameIndex]
        })
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing file:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
}