import Link from "next/link";
import { useTranslations } from "next-intl";
import { Container, Heading, Text, Button } from "@/components/ui";

export default function NotFound() {
    const t = useTranslations("notFound");

    return (
        <section className="min-h-[60vh] flex items-center justify-center bg-plume-cream">
            <Container size="narrow" className="text-center py-24">
                <span className="text-6xl mb-6 block">🔍</span>
                <Heading as="h1" className="mb-4">
                    {t("title")}
                </Heading>
                <Text size="lg" muted className="mb-8">
                    {t("description")}
                </Text>
                <Link href="/">
                    <Button size="lg">{t("cta")}</Button>
                </Link>
            </Container>
        </section>
    );
}
