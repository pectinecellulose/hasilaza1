/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as orderConfirmation } from './order-confirmation.tsx'
import { template as orderAdmin } from './order-admin.tsx'
import { template as contactConfirmation } from './contact-confirmation.tsx'
import { template as contactAdmin } from './contact-admin.tsx'
import { template as repairConfirmation } from './repair-confirmation.tsx'
import { template as repairAdmin } from './repair-admin.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'order-confirmation': orderConfirmation,
  'order-admin': orderAdmin,
  'contact-confirmation': contactConfirmation,
  'contact-admin': contactAdmin,
  'repair-confirmation': repairConfirmation,
  'repair-admin': repairAdmin,
}
