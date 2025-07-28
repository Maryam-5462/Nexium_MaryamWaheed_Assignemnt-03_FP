import pdf from 'pdf-parse'

export const parsePdf = async (buffer: Buffer) => {
  try {
    return await pdf(buffer)
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error}`)
  }
}