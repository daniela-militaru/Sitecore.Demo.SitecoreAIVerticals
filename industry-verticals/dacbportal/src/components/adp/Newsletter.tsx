import { ComponentProps } from '@/lib/component-props';
import { Field, NextImage as ContentSdkImage, Text } from '@sitecore-content-sdk/nextjs';
import type { Article } from '@/types/article';

interface Fields {
  Title?: Field<string>;
  Articles: Article[];
}

export type NewsletterProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: NewsletterProps) => {
  const { params, fields } = props;
  const id = params.RenderingIdentifier;
  const styles = params.styles;

  const articles = fields?.Articles || [];

  // If there is no datasource or no articles, show a placeholder in editing only.
  if (!fields || articles.length === 0) {
    return (
      <div className={`component newsletter ${styles || ''}`} id={id}>
        [NEWSLETTER – no articles selected]
      </div>
    );
  }

  const getAnchorId = (article: Article, index: number) =>
    `newsletter-article-${article.id || index}`;

  return (
    <section className={`component newsletter bg-background ${styles || ''}`} id={id}>
      <div className="container py-8 lg:py-12">
        {fields.Title?.value && (
          <header className="mb-6 lg:mb-8">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              <Text field={fields.Title} />
            </h2>
          </header>
        )}

        {/* Index table of article titles */}
        <div className="border-border bg-muted/40 mb-8 rounded-md border p-4 lg:p-5">
          <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
            In this newsletter
          </h3>
          <ul className="space-y-1 text-sm">
            {articles.map((article, index) => (
              <li key={article.id || index} className="flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5 text-xs">{index + 1}.</span>
                <a
                  href={`#${getAnchorId(article, index)}`}
                  className="text-primary hover:underline"
                >
                  <Text field={article.fields.Title} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Article blocks */}
        <div className="space-y-8">
          {articles.map((article, index) => (
            <article
              key={article.id || index}
              id={getAnchorId(article, index)}
              className="border-border border-t pt-6 first:border-t-0 first:pt-0"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="md:w-24 md:shrink-0">
                  {article.fields.Image && (
                    <ContentSdkImage
                      field={article.fields.Image}
                      className="h-16 w-16 rounded-md object-cover md:h-20 md:w-20"
                    />
                  )}
                </div>

                <div className="md:flex-1">
                  <h3 className="text-foreground text-lg font-semibold">
                    <Text field={article.fields.Title} />
                  </h3>

                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    <Text field={article.fields.ShortDescription} />
                  </p>

                  <a
                    href={article.url}
                    className="text-primary mt-3 inline-flex text-sm font-medium hover:underline"
                  >
                    View full article
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
