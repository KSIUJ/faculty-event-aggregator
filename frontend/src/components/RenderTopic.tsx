import { TopicCategory } from '../types';
interface RenderTopicProps {
    topic: TopicCategory;
}   

export default function RenderTopic({ topic }: RenderTopicProps) {
    return <span>{topic.title}</span>
}
