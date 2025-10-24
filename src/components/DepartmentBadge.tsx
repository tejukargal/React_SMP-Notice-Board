import { Department } from '../types'
import { departmentInfo } from '../utils/departments'

interface DepartmentBadgeProps {
  department: Department
}

const DepartmentBadge = ({ department }: DepartmentBadgeProps) => {
  const info = departmentInfo[department]

  return (
    <div
      className={`${info.bgClass} border-2 ${info.borderClass} rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group`}
    >
      <div className="text-center">
        <div
          className={`text-3xl font-bold ${info.textClass} mb-2 group-hover:scale-110 transition-transform`}
        >
          {info.code}
        </div>
        <div className={`text-xs font-medium ${info.textClass}`}>
          {info.name}
        </div>
      </div>
    </div>
  )
}

export default DepartmentBadge
