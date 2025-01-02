import { JSX } from 'react';

/**
 * Matchコンポーネントは、条件に基づいて子要素を表示するためのコンポーネントです。
 *
 * example:
  * ```tsx
 * <Switch fallback={<div>Not found</div>}>
 *  <Match when={true}><div>First</div></Match>
 *  <Match when={false}><div>Second</div></Match>
 * </Switch>
 * ```
 *
 * @template T - 条件の型
 * @param {MatchProps<T>} props - コンポーネントのプロパティ
 * @param {T | undefined | null | false} props.when - 子要素を表示する条件
 * @param {JSX.Element} props.children - 条件が真のときに表示される子要素
 * @returns {JSX.Element} 条件が真の場合は子要素を、そうでない場合は空の要素を返します
 */
interface MatchProps<T> {
  when: T | undefined | null | false;
  children: JSX.Element;
}

export function Match<T>(props: MatchProps<T>): JSX.Element {
  // 条件が真の場合、子要素を表示
  if (props.when) {
    return <>{props.children}</>;
  }
  // 条件が偽の場合、空の要素を返す
  return <></>;
}

export default Match;
