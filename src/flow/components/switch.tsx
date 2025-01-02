import { JSX } from 'react';

/**
 * Switchコンポーネントは、子要素の中から条件に基づいて最初に真となる要素を表示します。
 * 条件が真となる要素がない場合は、フォールバック要素を表示します。
 *
 * example:
 * ```tsx
 * <Switch fallback={<div>Not found</div>}>
 *  <Match when={true}><div>First</div></Match>
 *  <Match when={false}><div>Second</div></Match>
 * </Switch>
 * ```
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {JSX.Element} [props.fallback] - すべての子要素が偽の場合に表示されるフォールバック要素
 * @param {JSX.Element | JSX.Element[]} props.children - 条件を持つ子要素（複数可）
 * @returns {JSX.Element} 条件が真の最初の子要素、またはフォールバック要素を返します
 */
export function Switch(props: {
  fallback?: JSX.Element;
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  // 子要素が配列でない場合、配列に変換
  const children: JSX.Element[] = Array.isArray(props.children) ? props.children : [props.children];

  // 各子要素をチェックし、条件が真のものを表示
  for (const child of children) {
    if (child.props.when) return <>{child}</>;
  }

  // 条件が真の子要素がない場合、フォールバック要素を表示
  return <>{props.fallback}</>;
}

export default Switch;
