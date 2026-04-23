import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Hasilaza Motor'

interface Props {
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  vehicleType?: string
  vehicleBrand?: string
  city?: string
  preferredDate?: string
  problemDescription?: string
}

const RepairAdmin = ({
  customerName, customerPhone, customerEmail,
  vehicleType, vehicleBrand, city, preferredDate, problemDescription,
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Nouvelle demande de dépannage</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🔧 Nouvelle demande de dépannage</Heading>

        <Section style={card}>
          <Text style={cardTitle}>Client</Text>
          <Hr style={hr} />
          {customerName && <Text style={cardLine}><strong>Nom :</strong> {customerName}</Text>}
          {customerPhone && <Text style={cardLine}><strong>Téléphone :</strong> {customerPhone}</Text>}
          {customerEmail && <Text style={cardLine}><strong>Email :</strong> {customerEmail}</Text>}
          {city && <Text style={cardLine}><strong>Ville :</strong> {city}</Text>}
        </Section>

        <Section style={card}>
          <Text style={cardTitle}>Véhicule</Text>
          <Hr style={hr} />
          {vehicleType && <Text style={cardLine}><strong>Type :</strong> {vehicleType}</Text>}
          {vehicleBrand && <Text style={cardLine}><strong>Marque / modèle :</strong> {vehicleBrand}</Text>}
          {preferredDate && <Text style={cardLine}><strong>Date souhaitée :</strong> {preferredDate}</Text>}
        </Section>

        {problemDescription && (
          <Section style={card}>
            <Text style={cardTitle}>Description du problème</Text>
            <Hr style={hr} />
            <Text style={cardLine}>{problemDescription}</Text>
          </Section>
        )}

        <Text style={footer}>Notification automatique — {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: RepairAdmin,
  subject: 'Nouvelle demande de dépannage',
  displayName: 'Notification dépannage (admin)',
  previewData: {
    customerName: 'Ibrahima Ndiaye',
    customerPhone: '+221 77 000 00 00',
    customerEmail: 'ibrahima@example.com',
    vehicleType: 'moto',
    vehicleBrand: 'Yamaha YBR 125',
    city: 'Dakar',
    preferredDate: '2026-04-25',
    problemDescription: 'Le moteur cale au démarrage.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0a0a0a', margin: '0 0 16px' }
const card = { backgroundColor: '#f7f7f8', borderRadius: '12px', padding: '16px 20px', margin: '20px 0' }
const cardTitle = { fontSize: '13px', fontWeight: 'bold', color: '#0a0a0a', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0 0 8px' }
const cardLine = { fontSize: '14px', color: '#333', margin: '4px 0' }
const hr = { borderColor: '#e5e5e5', margin: '8px 0 12px' }
const footer = { fontSize: '12px', color: '#999', margin: '32px 0 0' }
