import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Hasilaza Motor'

interface Props { name?: string; subject?: string }

const ContactConfirmation = ({ name, subject }: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Nous avons bien reçu votre message</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Merci{name ? `, ${name}` : ''} !</Heading>
        <Text style={text}>
          Nous avons bien reçu votre message{subject ? ` concernant « ${subject} »` : ''}.
          Notre équipe vous répondra sous 24h ouvrées.
        </Text>
        <Text style={text}>
          Pour toute urgence, n'hésitez pas à nous appeler au <strong>+221 76 935 83 17</strong> ou
          à nous écrire sur WhatsApp.
        </Text>
        <Text style={footer}>L'équipe {SITE_NAME} — Dakar, Sénégal</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactConfirmation,
  subject: 'Nous avons bien reçu votre message',
  displayName: 'Confirmation contact (client)',
  previewData: { name: 'Mamadou', subject: 'Demande de devis' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0a0a0a', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#444', lineHeight: '1.6', margin: '0 0 16px' }
const footer = { fontSize: '12px', color: '#999', margin: '32px 0 0' }
