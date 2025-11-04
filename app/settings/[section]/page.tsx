"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"

import { SettingsSectionPage } from "../_components/section-page"
import { isSectionKey } from "../sections"

type SettingsSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export default function SettingsSectionPageRoute({ params }: SettingsSectionPageProps) {
  const resolvedParams = use(params)
  const router = useRouter()

  const sectionParam = resolvedParams.section
  const validKey = isSectionKey(sectionParam) ? sectionParam : null

  useEffect(() => {
    if (!validKey) {
      router.replace("/settings")
    }
  }, [router, validKey])

  if (!validKey) {
    return null
  }

  return <SettingsSectionPage sectionKey={validKey} />
}