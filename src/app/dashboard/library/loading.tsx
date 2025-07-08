import { Spinner, Flex } from "@radix-ui/themes"

export default function Loading() {
  return (
    <Flex align="center" justify="center" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100
          dark:from-slate-800 dark:via-indigo-800 dark:to-purple-900">
      <Spinner size="3"/>
    </Flex>
  )
}