import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface Member {
  id: string
  name: string
  age?: number
  nation?: string
  parish?: string
  cathedral?: string
  chosenDiocese?: string
  region?: string
  phone?: string
  emergencyNum?: string
  profile?: string
}

type Status = 'loading' | 'success' | 'error'

const FIELD_LABELS: { key: keyof Member; label: string }[] = [
  { key: 'nation', label: '국적' },
  { key: 'age', label: '나이' },
  { key: 'parish', label: '본당' },
  { key: 'cathedral', label: '성당' },
  { key: 'chosenDiocese', label: '선택 교구' },
  { key: 'region', label: '지역' },
  { key: 'phone', label: '연락처' },
  { key: 'emergencyNum', label: '비상 연락처' },
]

function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3 text-sm text-zinc-500">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-zinc-200 border-t-zinc-500" />
      <p>불러오는 중...</p>
    </div>
  )
}

function Empty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-sm text-zinc-500">
      <span className="text-4xl">⚠️</span>
      <p>{message}</p>
    </div>
  )
}

const memberId = new URLSearchParams(location.search).get('id')

export default function App() {
  const [status, setStatus] = useState<Status>(memberId ? 'loading' : 'error')
  const [member, setMember] = useState<Member | null>(null)
  const [errorMsg, setErrorMsg] = useState(memberId ? '' : '멤버 ID가 필요합니다.')

  useEffect(() => {
    if (!memberId) return

    fetch(`${API_URL}/members/${memberId}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 404 ? '존재하지 않는 멤버입니다.' : '정보를 불러오지 못했습니다.')
        return res.json() as Promise<Member>
      })
      .then((data) => {
        setMember(data)
        setStatus('success')
      })
      .catch((e: unknown) => {
        setErrorMsg(e instanceof Error ? e.message : '네트워크 오류가 발생했습니다.')
        setStatus('error')
      })
  }, [])

  if (status === 'loading') return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f5]">
      <Spinner />
    </div>
  )

  if (status === 'error') return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f5]">
      <Empty message={errorMsg} />
    </div>
  )

  if (!member) return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f5] px-4 py-6">
      <div className="w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex flex-col items-center px-6 pt-8 pb-5">
          {/* 프로필 이미지 */}
          <div className="mb-4">
            {member.profile ? (
              <img
                src={member.profile}
                alt="프로필"
                className="h-[88px] w-[88px] rounded-full border-2 border-zinc-200 object-cover"
              />
            ) : (
              <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-2 border-zinc-200 bg-zinc-100 text-4xl">
                👤
              </div>
            )}
          </div>

          {/* 이름 */}
          <h1 className="mb-5 text-[22px] font-bold tracking-tight text-zinc-900">
            {member.name}
          </h1>

          {/* 구분선 */}
          <div className="mb-5 h-px w-full bg-zinc-100" />

          {/* 정보 목록 */}
          <dl className="w-full space-y-3">
            {FIELD_LABELS.map(({ key, label }) => {
              const value = key === 'age' && member[key] ? `${member[key]}세` : member[key]
              if (!value && value !== 0) return null
              return (
                <div key={key} className="flex items-baseline justify-between gap-2">
                  <dt className="shrink-0 text-[13px] text-zinc-500">{label}</dt>
                  <dd className="text-right text-[14px] font-medium text-zinc-900 break-keep">
                    {String(value)}
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>
      </div>
    </div>
  )
}
