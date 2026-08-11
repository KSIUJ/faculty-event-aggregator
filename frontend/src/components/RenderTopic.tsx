import type { TopicCategory } from '@/types'

interface TopicProps {
    topics: TopicCategory[]
}

export default function RenderTopic({ topics }: TopicProps) {
    if (topics.length === 0) {
        return <p>No topics specified</p>
    }

    return (
        <ul>
            {topics.map((topic) => (
                <li key={topic.id}>{topic.title}</li>
            ))}
        </ul>
    )
}
