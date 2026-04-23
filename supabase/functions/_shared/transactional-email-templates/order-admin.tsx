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
  productName?: string
  quantity?: number
  totalPrice?: string
  address?: string
  city?: string
  message?: string
}

const OrderAdmin = ({
  customerName, customerPhone, customerEmail,
  productName, quantity, totalPrice,
  address, city, message,
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Nouvelle commande sur {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🛒 Nouvelle commande reçue</Heading>
        <Text style={text}>Une nouvelle commande vient d'être passée sur le site.</Text>

        <Section style={card}>
          <Text style={cardTitle}>Client</Text>
          <Hr style={hr} />
          {customerName && <Text style={cardLine}><strong>Nom :</strong> {customerName}</Text>}
          {customerPhone && <Text style={cardLine}><strong>Téléphone :</strong> {customerPhone}</Text>}
          {customerEmail && <Text style={cardLine}><strong>Email :</strong> {customerEmail}</Text>}
          {(address || city) && (
            <Text style={cardLine}><strong>Adresse :</strong> {address}{address && city ? ', ' : ''}{city}</Text>
          )}
        </Section>

        <Section style={card}>
          <Text style={cardTitle}>Produit</Text>
          <Hr style={hr} />
          {productName && <Text style={cardLine}><strong>Produit :</strong> {productName}</Text>}
          {quantity && <Text style={cardLine}><strong>Quantité :</strong> {quantity}</Text>}
          {totalPrice && <Text style={cardLine}><strong>Total :</strong> {totalPrice}</Text>}
        </Section>

        {message && (
          <Section style={card}>
            <Text style={cardTitle}>Message du client</Text>
            <Hr style={hr} />
            <Text style={cardLine}>{message}</Text>
          </Section>
        )}

        <Text style={footer}>Notification automatique — {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderAdmin,
  subject: (data: Record<string, any>) =>
    `Nouvelle commande${data?.productName ? ` — ${data.productName}` : ''}`,
  displayName: 'Notification commande (admin)',
  previewData: {
    customerName: 'Aïssatou Diop',
    customerPhone: '+221 77 123 45 67',
    customerEmail: 'aissatou@example.com',
    productName: 'Tricycle Bajaj RE',
    quantity: 1,
    totalPrice: '2 500 000 FCFA',
    address: 'Cité Keur Gorgui',
    city: 'Dakar',
    message: 'Merci de me livrer en matinée.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0a0a0a', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#444', lineHeight: '1.6', margin: '0 0 16px' }
const card = { backgroundColor: '#f7f7f8', borderRadius: '12px', padding: '16px 20px', margin: '20px 0' }
const cardTitle = { fontSize: '13px', fontWeight: 'bold', color: '#0a0a0a', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0 0 8px' }
const cardLine = { fontSize: '14px', color: '#333', margin: '4px 0' }
const hr = { borderColor: '#e5e5e5', margin: '8px 0 12px' }
const footer = { fontSize: '12px', color: '#999', margin: '32px 0 0' }
