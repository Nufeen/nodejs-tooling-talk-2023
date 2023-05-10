# Тулинг ноды. Обзорная лекция

Когда фронту становится нужен nodejs?

- нужен свой плагин или loader для webpack
- надо запарсить данные
- нужно убрать часть кода в npm-библиотеку
- требуется удалённая процедура, которую удобнее всего выполнять на сервере (выгрузки, нотификации)
- нужен BFF или API Gateway
- понадобился SSR и ваш фасад станет серверным и должен будет держать нагрузку, за которой надо следить

##### BFF

https://refactoring.guru/ru/design-patterns/adapter

```
             ┌───────────┐            ┌───────────┐
             │           │            │           │
             │           │            │           │
   ─────────►│  adapter  │ ──────────►│   code    │
             │           │            │           │
             │           │            │           │
             └───────────┘            └───────────┘
```

https://refactoring.guru/ru/design-patterns/facade

```
         ┌─────────────┐       ┌─────────────┐
         │             │       │             │
         │             │       │             │
         │             │◄──────┤    code     │
         │             │       │             │
         │             │       │             │
         │             │       └─────────────┘
         │             │
   ─────►│   facade    │
         │             │       ┌─────────────┐
         │             │       │             │
         │             │       │             │
         │             │◄──────┤    code     │
         │             │       │             │
         │             │       │             │
         └─────────────┘       └─────────────┘
```

https://doka.guide/tools/gateway-bff/

```
                      ┌─────────────┐                      ┌──────────────┐
                      │             │                      │              │
                      │             │                      │              │
                      │             │◄─────────────────────┤     API1     │
                      │             │                      │              │
                      │             │                      │              │
                      │             │                      └──────────────┘
                      │             │
                      │             │
                      │             │                      ┌──────────────┐
                      │             │                      │              │
                      │     BFF     │                      │              │
   APP  ◄─────────────┤     aka     │ ◄────────────────────┤     API2     │
                      │ API GATEWAY │                      │              │
                      │             │                      │              │
                      │             │                      └──────────────┘
                      │             │
                      │             │
                      │             │                      ┌──────────────┐
                      │             │                      │              │
                      │             │                      │              │
                      │             │ ◄────────────────────┤     API3     │
                      │             │                      │              │
                      │             │                      │              │
                      └─────────────┘                      └──────────────┘
```

Примеры:

- кеширование (например апишка платная)
- хочется взаимодействовать по [grpc](https://grpc.io/docs/what-is-grpc/introduction/), а апишка отдаёт [rest](https://www.codecademy.com/article/what-is-rest)

##### Об SSR в двух словах

```
  ┌────────────┐          ┌───────────┐          ┌───────────┐
  │            │          │           │          │           │
  │            │          │           │          │           │
  │            │  html+js │   SSR     │ data for │           │
  │            │◄─────────┤   Server  │◄─────────┤           │
  │            │  first   │           │ first    │           │
  │            │  request │           │ render   │           │
  │            │          └───────────┘          │           │
  │  client    │                                 │           │
  │  browser   │                                 │    API    │
  │            │                                 │           │
  │            │                                 │           │
  │            │      client side requests       │           │
  │            │◄────────────────────────────────┤           │
  │            │                                 │           │
  │            │                                 │           │
  │            │                                 │           │
  └────────────┘                                 └───────────┘
```

Подробнее: https://www.patterns.dev/posts/server-side-rendering

Ещё подробнее на лекции о веб-архитектуре ;)

## Поднимаем свой сервер:

Посмотрим на минималистичные фреймворки

Про https://github.com/expressjs/express/ было на предыдущей лекции.

Давайте смотреть на https://github.com/fastify

[livecode example](https://github.com/Nufeen/nodejs-tooling-talk-2023/tree/cd78c077f7ce20c86a73a1046d83357d7bbb4ec4)

Остальные популярные фреймворки рассматривать не будем, про них будет немного на лекции об веб-архитектуре. Пара ссылок:

Про эволюцию и легковесность vs многозадачность фреймворков можно глянуть https://www.youtube.com/watch?v=dh3rKUYNlUw

Очень короткий обзор nodejs фреймворков https://howtojs.ru/obzor-backend-frameworks-nodejs/

**NOTE**. Обратите внимание на `.mjs`.

Исторически в ноде были свои модули: https://nodejs.org/api/modules.html#modules-commonjs-modules

Далее в es6 появились стандартные для языка модули: https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Modules

И их завезли в nodejs: https://nodejs.org/api/esm.html#modules-ecmascript-modules

Подробнее про путаницу с форматами модулей ноды: https://habr.com/ru/company/ruvds/blog/556744/

## Контракты на уровне кода:

```
       consumer                      supplier
       ┌───────────┐                ┌───────────┐
       │           │                │           │
       │           │                │           │
       │    fn     │ ──────────────►│  module   │
       │           │                │           │
       │           │                │           │
       └───────────┘                └───────────┘
       ожидают                       предоставляет
       соблюдения                    контракт
       контракта
```

Подробнее про источник идеи: https://www.cs.usfca.edu/~parrt/course/601/lectures/programming.by.contract.html

Идеи оттуда: https://www.eiffel.org/doc/solutions/Design_by_Contract_and_Assertions

Про ассерты в TS: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions

## Среда выполнения: TS

Реальность такова что в 2023 все пишут на [TS](https://www.typescriptlang.org/)

_Какую проблему решаем?_ В больших проектах он приносит 2 преимущества:

1. статический анализ (проверка корректности кода)

2. контракты

Downsides: этап компиляции, усложнение инфраструктуры

Для разработки хотелось бы запускать TS динамически

https://github.com/TypeStrong/ts-node

https://github.com/esbuild-kit/tsx

[livecode example](https://github.com/Nufeen/nodejs-tooling-talk-2023/tree/a7f0818ace8bb739e826557751b1612d25e803c9)

Ещё немного про watch-режимы

https://github.com/remy/nodemon

https://github.com/sindresorhus/awesome-nodejs#process-management

## Отладка хромом

https://nodejs.org/dist/latest-v18.x/docs/api/debugger.html

[livecode example](https://github.com/Nufeen/nodejs-tooling-talk-2023/blob/a3b195e0f5a78a73958faee5ce778d59ccb7fd6e/package.json#L9)

## Контракты в клиент-серверной архитектуре

```
       consumer                      supplier
       ┌───────────┐                ┌────────────┐
       │           │                │            │
       │           │                │            │
       │  client   │◄───────────────┤            │
       │           │                │            │
       │           │                │            │
       └───────────┘                │            │
                                    │            │
                                    │    api     │
       ┌───────────┐                │            │
       │           │                │            │
       │           │                │            │
       │  client   │◄───────────────┤            │
       │           │                │            │
       │           │                │            │
       └───────────┘                └────────────┘
       ожидают                       предоставляет
       соблюдения                    контракт
       контракта
```

_Какую проблему решаем?_ Версионирование, изменение кода

- Схемы как язык контрактов: https://json-schema.org/learn/getting-started-step-by-step

Объект:

```
{
    "productId": 42
}
```

```
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    }
  },
  "required": [ "productId" ]
}
```

### Swagger/openapi

[live code](https://github.com/Nufeen/nodejs-tooling-talk-2023/tree/30a7fef044d086105152751c080c14e7633c35ef)

Если вы провайдер: например https://www.npmjs.com/package/fastify-oas

Если вы консьюмер: https://www.npmjs.com/package/openapi-typescript

[пример из практики] или https://starkovden.github.io/swagger-ui-demo.html

##### Дополнительно для интересующихся:

Развитие идеи контрактов в микросервисной (асинхронной, событийной) архитектуре -- schema-registry:

https://docs.confluent.io/platform/current/schema-registry/index.html#about-sr

https://www.youtube.com/watch?v=2bPx3hfKX04 (Key Concepts of Schema Registry / Confluent)

## 12 факторов и nodeenv

_Какую проблему решаем?_ Конфигурирование инстанса приложения.

```
        ┌──────────────────────────────┐
        │                              │
        │  ┌─────────────┐             │
        │  │             │             │
        │  │             │             │
    ────┼─►│     app1    │◄────── env  ◄──────  env variables set 1
        │  │             │             │
        │  │             │             │
        │  └─────────────┘             │
        │                              │
        └──────────────────────────────┘

        ┌──────────────────────────────┐
        │                              │
        │  ┌─────────────┐             │
        │  │             │             │
        │  │             │             │
    ────┼─►│     app2    │◄────── env  ◄──────  env variables set 2
        │  │             │             │
        │  │             │             │
        │  └─────────────┘             │
        │                              │
        └──────────────────────────────┘
```

12 факторов: https://habr.com/ru/post/258739/: "Сохраняйте конфигурацию в среде выполнения"

О переменных окружения: https://ru.hexlet.io/courses/cli-basics/lessons/environment-variables/theory_unit

https://medium.com/@hydrock/переменные-окружения-в-приложении-node-js-e9ca2131e6b6

https://www.npmjs.com/package/dotenv

# Логи

_Какую проблему решаем?_ Нормальные логи :)

- логи нужны для: отладки

- для исследования аномалий

- для анализа трафика

```
        ┌─────────────────────────────────────────────────┐
        │                                                 │
        │  ┌─────────────┐       ┌─────────────┐          │
        │  │             │       │             │          │
        │  │             │       │             │          │
        │  │             │       │             │          │
    ────┼─►│   nginx     │◄──────┤    app      │◄────► DB │
        │  │             │       │             │          │
        │  │             │       │             │          │
        │  │             │       │             │          │
        │  └─────────────┘       └─────────────┘          │
        │                                                 │
        └─────────────────────────────────────────────────┘
```

- Заходим на тачку, tail -f | grep по логу nginx

```

             ┌─────────────┐       ┌─────────────┐       ┌──────────────┐
             │             │       │             │       │              │
             │             │       │             │       │              │
             │             │       │             │       │              │
      ──────►│    nginx    │◄──────┤   facade    │◄──────┤     api      │◄────► DB
             │             │       │             │       │              │
             │             │       │             │       │              │
             │             │       │             │       │              │
             └─────────────┘       └─────────────┘       └──────────────┘

```

- а что если появляется несколько сервисов? Заходить на каждую? А форматы логов?

```
         ┌─────────────┐       ┌─────────────┐       ┌──────────────┐
         │             │       │             │       │              │
         │             │       │             │       │              │
         │             │       │             │       │              │
         │             │◄──────┤   facade    │◄──────┤              │
         │             │       │             │       │              │
         │             │       │             │       │              │
         │             │       │             │       │              │
         │             │       └─────────────┘       │              │
         │             │                             │              │
   ─────►│  балансер   │                             │      api     │◄────► DB
         │             │       ┌─────────────┐       │              │
         │             │       │             │       │              │
         │             │       │             │       │              │
         │             │       │             │       │              │
         │             │◄──────┤   facade    │◄──────┤              │
         │             │       │             │       │              │
         │             │       │             │       │              │
         │             │       │             │       │              │
         └─────────────┘       └─────────────┘       └──────────────┘

```

- а что если у нас горизонтальное масштабирование и несколько инстансов?

- а что если логов больше чем диска у тачки?

Кажется хранение на тачке плохо масштабируется \o/

```
       ┌────────────────┐       ┌──────────────┐        ┌─────────────┐
       │                │       │              │        │             │
       │  ┌──────────┐  │       │              │        │             │
       │  │          │  │       │              │        │             │
       │  │          │  │       │              │        │             │
       │  │  app     │  │       │              │        │             │
       │  │          │  │       │              │        │             │
       │  │          │  │       │              │        │             │
       │  └──────────┘  │       │              │        │             │
       │                │       ┤   сборщик    │◄───────┤     DB      │
       │  ┌──────────┐  │       │              │        │             │
       │  │          │  │       │              │        │             │
       │  │          │  │       │              │        │             │
       │  │ exporter │  │◄──────│              │        │             │
       │  │          │  │       │              │        │             │
       │  │          │  │       │              │        │             │
       │  └──────────┘  │       │              │        │             │
       │                │       │              │        │             │
       └────────────────┘       └──────────────┘        └─────────────┘
           system
```

Схема упрощена, реальный список возможных источников: https://www.elastic.co/guide/en/logstash/current/input-plugins.html

Рельные схемы: https://kubernetes.io/docs/concepts/cluster-administration/logging/, https://habr.com/ru/companies/southbridge/articles/517636/

Наше дело -- отдать логи, например:

https://www.fastify.io/docs/latest/Reference/Logging/

https://github.com/pinojs/pino

https://github.com/sindresorhus/awesome-nodejs#logging

Подробнее: https://aws.amazon.com/ru/what-is/elk-stack/

# Мониторинг

```
       ┌────────────────┐       ┌──────────────┐        ┌─────────────┐
       │                │       │              │        │             │
       │  ┌──────────┐  │       │              │        │             │
       │  │          │  │       │              │        │             │
       │  │          │  │       │              │        │             │
       │  │   app    │  │◄──────│              │        │             │
       │  │          │  │       │              │        │             │
       │  │          │  │       │              │        │             │
       │  └──────────┘  │       │              │        │             │
       │                │       │   сборщик    │◄───────┤     DB      │
       │  ┌──────────┐  │       │              │        │             │
       │  │          │  │       │              │        │             │
       │  │          │  │       │              │        │             │
       │  │ exporter │  │◄──────│              │        │             │
       │  │          │  │       │              │        │             │
       │  │          │  │       │              │        │             │
       │  └──────────┘  │       │              │        │             │
       │                │       │              │        │             │
       └────────────────┘       └──────────────┘        └─────────────┘
           system
```

Человеческим языком про метрики: Потерянное введение: https://habr.com/ru/company/tochka/blog/683608/

Метрики собираются:

- из приложения
- из системы
- с балансировщиков

[Пример](https://github.com/Nufeen/nodejs-tooling-talk-2023/commit/4821e85defc76b1dbacb840cfd75461cf8ec7b09)

Например: https://github.com/tdeekens/promster

## Кеши

_Какую проблему решаем?_ Нагрузка, масштабирование, производительность

##### Внутренние кеши, общие

```
                                                                                  ┌────────────┐
                                                     ┌──────────┐                 │            │
                                                     │          │                 │            │
                                                     │          │                 │            │
                                           ┌────────►│   app    │ ◄───────────────┤            │
                                           │         │          │                 │            │
                         ┌──────────┐      │         │          │                 │            │
                         │          │      │         └──────────┘                 │            │
                         │          │      │                                      │   redis    │
              ──────────►│ balancer ├──────┤                                      │            │
                         │          │      │                                      │   cache    │
                         │          │      │         ┌──────────┐                 │            │
                         └──────────┘      │         │          │                 │            │
                                           │         │          │                 │            │
                                           └────────►│   app    │ ◄───────────────┤            │
                                                     │          │                 │            │
                                                     │          │                 │            │
                                                     └──────────┘                 └────────────┘
```

##### Внешние кеши, общие

```
                                                                ┌──────────┐
                                                                │          │
                                                                │          │
                                                      ┌────────►│   app    │
                                                      │         │          │
             ┌──────────┐           ┌──────────┐      │         │          │
             │          │           │          │      │         └──────────┘
             │          │           │          │      │
  ──────────►│ balancer ├──────────►│  cache   ├──────┤
             │          │           │          │      │
             │          │           │          │      │         ┌──────────┐
             └──────────┘           └──────────┘      │         │          │
                                                      │         │          │
                                                      └────────►│   app    │
                                                                │          │
                                                                │          │
                                                                └──────────┘
```

##### Раздельные кеши в памяти

```
                                        ┌──────────┬─────────┐
                                        │          │         │
                                        │          │         │
                              ┌────────►│   app    │ cache   │
                              │         │          │         │
            ┌──────────┐      │         │          │         │
            │          │      │         └──────────┴─────────┘
            │          │      │
 ──────────►│ balancer ├──────┤
            │          │      │
            │          │      │         ┌──────────┬─────────┐
            └──────────┘      │         │          │         │
                              │         │          │         │
                              └────────►│   app    │ cache   │
                                        │          │         │
                                        │          │         │
                                        └──────────┴─────────┘
```

##### Раздельные кеши на сетевом уровне

```
                                   ┌──────────┐     ┌─────────┐
                                   │          │     │         │
                                   │          │     │         │
                         ┌────────►│ cache    ├─────►  app    │
                         │         │          │     │         │
       ┌──────────┐      │         │          │     │         │
       │          │      │         └──────────┘     └─────────┘
       │          │      │
──────►│ balancer ├──────┤
       │          │      │
       │          │      │         ┌──────────┐     ┌─────────┐
       └──────────┘      │         │          │     │         │
                         │         │          │     │         │
                         └────────►│ cache    ├─────►  app    │
                                   │          │     │         │
                                   │          │     │         │
                                   └──────────┘     └─────────┘
```

https://hazelcast.com/blog/architectural-patterns-for-caching-microservices/

Redis: https://habr.com/ru/company/wunderfund/blog/685894/

https://www.npmjs.com/package/node-cache

## Фича-флаги

- Иногда мы хотим тестировать функции, которые ты не хотим показывать всем пользователям
- Как правило это происходит потому что мы хотим поставлять крупную фичу небольшими частями
- Для этого функционал спрятан за условие, которое мы будем называть флагом
- Флаг можно хранить прямо в коде, в .env и в отдельном хранилище

```
                 ┌────────────┐           ┌─────────────┐
                 │            │ update    │             │
                 │ flag       │ flags     │ flag        │
                 │ management │◄──────────┤ management  │
                 │ system     │           │ ui          │
                 │            │           │             │
                 └───▲─────┬──┘           └─────────────┘
                     │     │
             check   │     │
             flag X  │     │ true/false
                     │     │
                     │     │
              ┌──────┼─────┼───────────────────────────────┐
              │      │     │                               │
              │  ┌───┴─────▼───┐          ┌─────────────┐  │
 result       │  │             │          │             │  │
 ◄────────────┼──┤             │ call if  │             │  │
              │  │ check flags ├─────────►│ feature X   │  │
 ─────────────┼──►             │ X active │             │  │
 request      │  │             │          │             │  │
 page with    │  └─────────────┘          └─────────────┘  │
 feature X    │                                            │
              └────────────────────────────────────────────┘
                              app
```

TBD: https://habr.com/ru/company/avito/blog/680522/

https://www.atlassian.com/continuous-delivery/principles/feature-flags

https://docs.gitlab.com/ee/operations/feature_flags.html

https://github.com/Unleash/unleash

https://github.com/Unleash/unleash-client-node

https://launchdarkly.com/
