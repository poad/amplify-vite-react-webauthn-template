import { JSX } from 'react';

/**
 * Showコンポーネントは、条件に応じて子要素またはフォールバック要素を表示するためのコンポーネントです。
 *
 * @template T - 条件の型
 * @param {Object} props - コンポーネントのプロパティ
 * @param {T | undefined | null | false} props.when - 子要素を表示する条件
 * @param {JSX.Element} [props.fallback] - 条件が偽の場合に表示されるフォールバック要素
 * @param {JSX.Element} props.children - 条件が真のときに表示される子要素
 * @returns {JSX.Element} 条件が真の場合は子要素を、偽の場合はフォールバック要素を返します
 */
export function Show<T>(props: {
  when: T | undefined | null | false;
  fallback?: JSX.Element;
  children: JSX.Element;
}): JSX.Element {
  // 条件が真の場合、子要素を表示
  if (props.when) {
    return (
      <>
        {props.children}
      </>
    );
  }
  // 条件が偽の場合、フォールバック要素を表示
  return <>{props.fallback}</>;
}

export default Show;
