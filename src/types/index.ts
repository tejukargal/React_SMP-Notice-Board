export type Department = 'CE' | 'ME' | 'CS' | 'EC' | 'EE' | 'All' | 'Office' | 'Results' | 'Fee Dues' | 'Exams' | 'Scholarships' | 'Internship' | 'Annual Day' | 'Functions' | 'Admission Ticket' | 'Admissions'

export interface FileAttachment {
  name: string
  type: string
  size: number
  base64: string
}

export interface Circular {
  id: string
  title: string
  date: string
  subject: string
  department: Department
  body: string
  attachments: FileAttachment[]
  created_at: string
  is_featured?: boolean
}

export interface AdminUser {
  id: string
  username: string
  password_hash: string
  created_at: string
}

export interface DepartmentInfo {
  code: Department
  name: string
  color: string
  lightColor: string
  bgClass: string
  textClass: string
  borderClass: string
}
