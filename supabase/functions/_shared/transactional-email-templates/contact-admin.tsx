import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Hasilaza Motor'

interface Props {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
}

const ContactAdmin = ({ name, email, phone, subject, message }: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Nouveau message de contact{name ? ` — ${name}` : ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>📩 Nouveau message de contact</Heading>
        <Section style={card}>
          {name && <Text style={cardLine}><strong>Nom :</strong> {name}</Text>}
          {email && <Text style={cardLine}><strong>Email :</strong> {email}</Text>}
          {phone && <Text style={cardLine}><strong>Téléphone :</strong> {phone}</Text>}
          {subject && <Text style={cardLine}><strong>Sujet :</strong> {subject}</Text>}
          {message && (
            <>
              <Hr style={hr} />
              <Text style={cardLine}>{message}</Text>
            </>
          )}
        </Section>
        <Text style={footer}>Notification automatique — {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactAdmin,
  subject: (data: Record<string, any>) =>
    `Nouveau message${data?.subject ? ` — ${data.subject}` : ''}`,
  displayName: 'Notification contact (admin)',
  previewData: {
    name: 'Mamadou Sow',
    email: 'mamadou@example.com',
    phone: '+221 77 000 00 00',
    subject: 'Demande de devis',
    message: 'Bonjour, je souhaite un devis pour 3 tricycles.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0a0a0a', margin: '0 0 16px' }
const card = { backgroundColor: '#f7f7f8', borderRadius: '12px', padding: '16px 20px', margin: '20px 0' }
const cardLine = { fontSize: '14px', color: '#333', margin: '4px 0' }
const hr = { borderColor: '#e5e5e5', margin: '12px 0' }
const footer = { fontSize: '12px', color: '#999', margin: '32px 0 0' }
