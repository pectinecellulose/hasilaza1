import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Hasilaza Motor'

interface Props {
  customerName?: string
  productName?: string
  quantity?: number
  totalPrice?: string
  address?: string
  city?: string
}

const OrderConfirmation = ({
  customerName,
  productName,
  quantity,
  totalPrice,
  address,
  city,
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Votre commande chez {SITE_NAME} a bien été reçue</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Merci pour votre commande{customerName ? `, ${customerName}` : ''} !</Heading>
        <Text style={text}>
          Nous avons bien reçu votre commande chez {SITE_NAME}. Notre équipe vous
          contactera très rapidement par téléphone ou WhatsApp pour confirmer les
          détails et organiser la livraison.
        </Text>

        <Section style={card}>
          <Text style={cardTitle}>Récapitulatif</Text>
          <Hr style={hr} />
          {productName && <Text style={cardLine}><strong>Produit :</strong> {productName}</Text>}
          {quantity && <Text style={cardLine}><strong>Quantité :</strong> {quantity}</Text>}
          {totalPrice && <Text style={cardLine}><strong>Total :</strong> {totalPrice}</Text>}
          {(address || city) && (
            <Text style={cardLine}><strong>Livraison :</strong> {address}{address && city ? ', ' : ''}{city}</Text>
          )}
        </Section>

        <Text style={text}>
          Le paiement se fait à la livraison. Aucune avance ne vous sera demandée.
        </Text>

        <Text style={footer}>L'équipe {SITE_NAME} — Dakar, Sénégal</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderConfirmation,
  subject: 'Votre commande a bien été reçue',
  displayName: 'Confirmation de commande (client)',
  previewData: {
    customerName: 'Aïssatou',
    productName: 'Tricycle Bajaj RE',
    quantity: 1,
    totalPrice: '2 500 000 FCFA',
    address: 'Cité Keur Gorgui',
    city: 'Dakar',
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
