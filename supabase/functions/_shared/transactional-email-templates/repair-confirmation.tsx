import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Hasilaza Motor'

interface Props { name?: string; vehicleType?: string }

const RepairConfirmation = ({ name, vehicleType }: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Votre demande de dépannage a bien été enregistrée</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Demande reçue{name ? `, ${name}` : ''} !</Heading>
        <Text style={text}>
          Nous avons bien reçu votre demande de dépannage{vehicleType ? ` pour votre ${vehicleType}` : ''}.
          Un technicien vous contactera sous 24h pour planifier l'intervention.
        </Text>
        <Text style={text}>
          Pour toute urgence, appelez-nous directement au <strong>+221 76 935 83 17</strong>.
        </Text>
        <Text style={footer}>L'équipe technique {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: RepairConfirmation,
  subject: 'Votre demande de dépannage a été enregistrée',
  displayName: 'Confirmation dépannage (client)',
  previewData: { name: 'Ibrahima', vehicleType: 'moto' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0a0a0a', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#444', lineHeight: '1.6', margin: '0 0 16px' }
const footer = { fontSize: '12px', color: '#999', margin: '32px 0 0' }
