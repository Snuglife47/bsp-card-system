export const BRANCH_NAME: Record<string, string> = {
  '951': 'Waigani',
  '968': 'Vision City',
  '943': 'Boroko',
  '970': 'Port Moresby',
  '202': 'Town',
  '307': 'Gordons',
  '950': 'Harbour City',
}

export function branchName(code: string): string {
  return BRANCH_NAME[code] ? `${BRANCH_NAME[code]} (${code})` : `branch ${code}`
}
