import type { TopicCategory } from '@/types'

interface TopicProps {
    topic: TopicCategory
}   

export default function RenderTopic({ topic }: TopicProps) {
    return (
        <span>
            {topic.title}
        </span>
    )
}
