/**
 * Seed Psychology Knowledge Base to Pinecone
 *
 * Usage: npx tsx scripts/seed-knowledge-base.ts
 */

import { getPineconeClient, PINECONE_INDEX_NAME, EMBEDDING_DIMENSION } from '@/lib/rag/pinecone-config'
import { generateEmbeddingsBatch } from '@/lib/rag/embeddings'
import { ALL_KNOWLEDGE } from '@/lib/rag/knowledge-base'

async function seedKnowledgeBase() {
  console.log('🌱 Starting knowledge base seeding...')

  try {
    // 1. Initialize Pinecone
    const pinecone = getPineconeClient()
    console.log('✅ Pinecone client initialized')

    // 2. Check if index exists, create if not
    const existingIndexes = await pinecone.listIndexes()
    const indexExists = existingIndexes.indexes?.some(idx => idx.name === PINECONE_INDEX_NAME)

    if (!indexExists) {
      console.log(`📝 Creating index: ${PINECONE_INDEX_NAME}`)
      await pinecone.createIndex({
        name: PINECONE_INDEX_NAME,
        dimension: EMBEDDING_DIMENSION,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1',
          },
        },
      })

      // Wait for index to be ready
      console.log('⏳ Waiting for index to be ready...')
      await new Promise(resolve => setTimeout(resolve, 60000)) // 60 seconds
    } else {
      console.log(`✅ Index already exists: ${PINECONE_INDEX_NAME}`)
    }

    const index = pinecone.index(PINECONE_INDEX_NAME)

    // 3. Generate embeddings for all knowledge entries
    console.log(`📊 Generating embeddings for ${ALL_KNOWLEDGE.length} entries...`)

    const texts = ALL_KNOWLEDGE.map(entry => `${entry.title}\n\n${entry.content}`)
    const embeddings = await generateEmbeddingsBatch(texts)

    console.log(`✅ Generated ${embeddings.length} embeddings`)

    // 4. Upsert to Pinecone in batches
    const BATCH_SIZE = 100
    let totalUpserted = 0

    for (let i = 0; i < ALL_KNOWLEDGE.length; i += BATCH_SIZE) {
      const batch = ALL_KNOWLEDGE.slice(i, i + BATCH_SIZE)
      const batchEmbeddings = embeddings.slice(i, i + BATCH_SIZE)

      const vectors = batch.map((entry, idx) => ({
        id: entry.id,
        values: batchEmbeddings[idx],
        metadata: {
          title: entry.title,
          content: entry.content,
          namespace: entry.namespace,
          ...entry.metadata,
        },
      }))

      await index.upsert(vectors)
      totalUpserted += vectors.length

      console.log(`📤 Upserted batch ${Math.floor(i / BATCH_SIZE) + 1}: ${vectors.length} vectors`)
    }

    console.log(`\n✅ Seeding complete!`)
    console.log(`📊 Total entries: ${totalUpserted}`)
    console.log(`🎯 Index: ${PINECONE_INDEX_NAME}`)
    console.log(`\n🚀 Knowledge base is ready for use!`)

  } catch (error: any) {
    console.error('❌ Seeding failed:', error)
    console.error(error.stack)
    process.exit(1)
  }
}

// Run seeding
seedKnowledgeBase()
