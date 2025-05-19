import { Link } from "@remix-run/react";

export default function ManualPage() {
    return (
        <section className="container mx-auto py-10 px-4">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    ヴォイドライブ
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">オンラインマニュアル</p>
            </div>

            {/* 目次セクション */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">目次</h2>
                <ul className="space-y-2">
                    <li className="hover:text-cyan-500 transition-colors">
                        <a href="#overview" className="flex items-center">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                            概要
                        </a>
                    </li>
                    <li className="hover:text-cyan-500 transition-colors">
                        <a href="#introduction" className="flex items-center">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                            はじめに
                        </a>
                    </li>
                    <li className="hover:text-cyan-500 transition-colors">
                        <a href="#contents" className="flex items-center">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                            内容物
                        </a>
                    </li>
                    <li className="hover:text-cyan-500 transition-colors">
                        <a href="#card-types" className="flex items-center">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                            カードの種類
                        </a>
                    </li>
                    <li className="hover:text-cyan-500 transition-colors">
                        <a href="#game-flow" className="flex items-center">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                            ゲームの流れ
                        </a>
                    </li>
                    <li className="hover:text-cyan-500 transition-colors">
                        <a href="#field" className="flex items-center">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                            フィールド
                        </a>
                    </li>
                    <li className="hover:text-cyan-500 transition-colors">
                        <a href="#terms" className="flex items-center">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                            用語説明
                        </a>
                    </li>
                </ul>
            </div>

            {/* 概要 */}
            <div id="overview" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">概要</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">プレイ人数</h3>
                        <p>2人</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">プレイ時間</h3>
                        <p>10分〜20分</p>
                    </div>
                </div>
            </div>

            {/* はじめに */}
            <div id="introduction" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">はじめに</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    このゲームは、2人対戦型のカードゲームです。
                    プレイヤーは「ドライバー」と呼ばれるあなたの分身を選んで、相手と対戦します。
                    盤面の表裏を切り替わる、一風変わったゲーム体験をお届けします。
                    デッキが切れても負けじゃない。盤面も戦況もひっくり返る新感覚バトルをお楽しみあれ。
                </p>
            </div>

            {/* 内容物 */}
            <div id="contents" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">内容物</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>ドライバーカード(ケイ、マナ各種1枚)</li>
                    <li>各ドライバーのデッキ(34種80枚)</li>
                    <li>予備カード(12種類 / 12枚)</li>
                </ul>
            </div>

            {/* カードの種類 */}
            <div id="card-types" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">カードの種類</h2>

                {/* カード紹介：Manaの例 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-12">
                    <div className="flex flex-col items-center">
                        <img src="/images/voidrive/driver-front.png" alt="ドライバーカード" className="rounded-lg shadow-lg w-full max-w-xs mb-4" />
                        <span className="text-lg font-bold text-gray-700 dark:text-gray-200">ドライバー例</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-md text-center md:col-span-2">
                        <h3 className="text-2xl font-bold mb-2 text-cyan-500 tracking-widest">ドライバー</h3>
                        <div className="text-left text-gray-600 dark:text-gray-300 text-sm space-y-2">
                            <p><b>初期手札</b>　ゲーム開始時の手札の枚数を表します。</p>
                            <p><b>プロテクター</b>　ゲーム開始時のプロテクターの枚数を表します。</p>
                            <p><b>エーテル</b>　ターン開始時のエーテルの供給枚数を表します。</p>
                            <p className="mt-4">（表面記載）</p>
                            <p><b>ドライブ</b>　このドライバーが表面で発動できる能力の効果を表します。</p>
                            <p className="mt-4">（裏面記載）</p>
                            <p><b>ヴォイドライブ</b>　このドライバーが裏面で発動できる能力の効果を表します。</p>
                        </div>
                    </div>
                </div>

                {/* エージェント紹介サンプル */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-12">
                    <div className="flex flex-col items-center">
                        <img src="/images/voidrive/agent.png" alt="エージェントカード例" className="rounded-lg shadow-lg w-full max-w-xs mb-4" />
                        <span className="text-lg font-bold text-gray-700 dark:text-gray-200">エージェント例</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-md text-center md:col-span-2">
                        <h3 className="text-2xl font-bold mb-2 text-cyan-500 tracking-widest">エージェント</h3>
                        <div className="text-left text-gray-600 dark:text-gray-300 text-sm space-y-2">
                            <p>エージェントゾーンに出して戦わせるカードです。</p>
                            <p><b>名前</b>：このエージェントの名前を表します。</p>
                            <p><b>コスト</b>：このエージェントを場に出す、維持するのに必要なコストの値を表します。</p>
                            <p><b>攻撃力</b>：このエージェントが持つ攻撃力の値を表します。</p>
                            <p><b>速度</b>：このエージェントが持つ速度の値を表します。自身より速度が高いカードは、攻撃及び効果の対象にできません。</p>
                            <p><b>効果</b>：このエージェントが持つ効果を表します。</p>
                        </div>
                    </div>
                </div>

                {/* キャスト紹介サンプル */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-12">
                    <div className="flex flex-col items-center">
                        <img src="/images/voidrive/cast.png" alt="キャストカード例" className="rounded-lg shadow-lg w-full max-w-xs mb-4" />
                        <span className="text-lg font-bold text-gray-700 dark:text-gray-200">キャスト例</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-md text-center md:col-span-2">
                        <h3 className="text-2xl font-bold mb-2 text-cyan-500 tracking-widest">キャスト</h3>
                        <div className="text-left text-gray-600 dark:text-gray-300 text-sm space-y-2">
                            <p>キャストゾーンに出して効果を発動するカードです。</p>
                            <p>キャストには、アクション、ファンクション、リアクションの3種類があります。</p>
                            <p>キャストの種類は、カードの左上か枠の色で判別できます。</p>
                            <p>アクション：青枠、ファンクション：緑枠、リアクション：赤枠</p>
                            <p><b>名前</b>：このキャストの名前を表します。</p>
                            <p><b>コスト</b>：このキャストを発動する、維持するのに必要なコストの値を表します。</p>
                            <p><b>速度</b>：このキャストが持つ速度の値を表します。自身より速度が高いカードは効果の対象にできません。</p>
                            <p><b>効果</b>：このキャストが持つ効果を表します。</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ゲームの流れ */}
            <div id="game-flow" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">ゲームの流れ</h2>

                {/* 準備 */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">準備</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        ドライバーカードと、デッキをそれぞれ選び、下記のように場に置きます。
                        ドライバーとデッキには、モチーフとなる関係のものがありますが、必ずその組み合わせでなければならないという訳ではありません。
                        慣れてきたら、ドライバーをマナ、デッキをケイのように入れ替えて遊んでみてください。
                    </p>
                </div>

                {/* ターンの流れ */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">ターンの流れ</h3>
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">ドローフェイズ</h4>
                            <p className="text-gray-600 dark:text-gray-300">
                                デッキの上からカードを1枚引きます。
                                その後、ドライバーによって記された枚数分、デッキの上からエーテルゾーンに裏向きでセットします。
                                "自分のターン開始時"などの効果はこのドロー後に処理します。
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">コレクトフェイズ</h4>
                            <p className="text-gray-600 dark:text-gray-300">
                                場にあるカードの維持コストを支払います。
                                エージェントを左から(古い)順に、1枚ずつ維持するか、破壊するか処理します。
                                その後、ファンクションを左から(古い)順に1枚ずつ維持するか、破壊するか処理します。
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">メインフェイズ</h4>
                            <p className="text-gray-600 dark:text-gray-300">
                                ドライブ/ヴォイドライブを使用したり、手札のカードを使用したり、場のエージェントで攻撃を行います。
                                行う順番は自由です。
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">エンドフェイズ</h4>
                            <p className="text-gray-600 dark:text-gray-300">
                                ターンを終了し相手にターンを渡します。
                                "自分のターン終了時"などの効果はこのタイミングで処理します。
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* フィールド */}
            <div id="field" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">フィールド</h2>
                <div className="text-gray-600 dark:text-gray-300">
                    <p className="mb-4">縦3列横6列</p>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg font-mono">
                        <p>エエエエエ 墓</p>
                        <p>キキドキキ 魔</p>
                        <p>プププププ 山</p>
                    </div>
                    <p className="mt-4">
                        エージェント=エ、キャスト=キ、プロテクター=プ、ドライバー=ド、墓地=墓、エーテル=魔、デッキ=山
                        (プロテクターは最大枚数制限なし、エーテルは10枚まで)
                    </p>
                </div>
            </div>

            {/* 用語説明 */}
            <div id="terms" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">用語説明</h2>
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">《顕現》</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            手札からコストを支払って場に出した時に発動する能力。
                            カードの効果や、カウンターで場に出た場合は発動しません。
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">《破壊》</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            破壊された時に発動する能力。
                            この効果の処理中は場に残っているものとし、この効果処理が終わったあとに墓地に送られます。
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">《攻撃》</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            攻撃した際に発動する能力です。
                            戦闘を行う前に発動し、この効果処理が終わったら戦闘を行います。
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">《即行》</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            場に出したターンから攻撃できる能力です。
                            初めから横向き(タップ状態)ではなく、縦向き(アンタップ状態)で場に出ます。
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">《挑発》</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            相手は、この効果を持つエージェントしか攻撃対象に選べなくなる能力です。
                            速度の値に関係なく、相手は攻撃する場合このエージェントしか選べません。
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">エーテル</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            カードを使用、維持するのに必要なコストを支払うためのカードのこと。
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">ダイブ</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            デッキが切れた状態でカードを引こうとしたときに強制発動する処理。<br />
                            自身のデッキと墓地を入れ替えて、ドライバーのカードを裏返してゲームを続行します。<br />
                            カードを引く効果の処理中だった場合、キャンセルせずに続行します。<br />
                            <span className="block mt-2 text-xs text-gray-400">例：デッキが残り1枚の状態でカードを2枚引く効果を発動→１枚引いてダイブ→ダイブ後にもう1枚引く</span>
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">コレクト</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            ターン開始時、ドロー後のくるフェイズのこと。<br />
                            自分の場にあるエージェント、ファンクションカードを維持するために、それぞれのカードに記されたコストを支払います。<br />
                            もしくは、支払わずにそのカードを破壊します。
                        </p>
                    </div>
                </div>
            </div>

            {/* エーテルについて */}
            <div id="ether" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">エーテルについて</h2>
                <div className="text-gray-600 dark:text-gray-300 space-y-2">
                    <p>カードの使用や維持に使用されます。</p>
                    <p>指定がない限りは裏向きで存在し、コストを支払う場合はその値と同じ枚数エーテルから墓地に送ります。</p>
                    <p>最大枚数は10枚です。最大枚数を超える場合、エーテルに加える処理はスキップされます。</p>
                </div>
            </div>

            {/* カードの使用について */}
            <div id="card-usage" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">カードの使用について</h2>
                <div className="text-gray-600 dark:text-gray-300 space-y-4">
                    <p>カードの右上に記されたコストを、エーテルから支払ってカードを使用できます。</p>
                    <div>
                        <b>エージェントの場合</b>
                        <p>自分の場のエージェントエリアに基本的に横向き(タップ状態)で出します。<br />
                            《即行》と書かれたエージェントは、最初から縦向き(アンタップ状態)で場に出ます。</p>
                    </div>
                    <div>
                        <b>アクションの場合</b>
                        <p>自分の場のキャストエリアに出します。そのまま効果を処理し、そのカードの処理が終わったら墓地に送られます。</p>
                    </div>
                    <div>
                        <b>ファンクションの場合</b>
                        <p>自分の場のキャストエリアに出します。そのまま効果を処理しますが、その後も場に残り続けます。</p>
                    </div>
                    <div>
                        <b>リアクションの場合</b>
                        <p>自分の場に裏向きで伏せてセットします。この時点ではコストはかかりません。伏せたターン以降、カードの効果によって決められたタイミングで任意に発動できます。この時にコストをエーテルから支払います。</p>
                    </div>
                    <div>
                        <b>カウンターと書かれたカードについて</b>
                        <p>Counterと書かれたカードは、プロテクターから破壊された場合にコストを消費せずに使用できます。エージェントの場合はそのまま自分の場に出し、キャストの場合はそのまま発動します。その際、効果は《カウンター》と書かれた行から処理します。</p>
                    </div>
                </div>
            </div>

            {/* ドライブ/ヴォイドライブについて */}
            <div id="drive" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">ドライブ/ヴォイドライブについて</h2>
                <div className="text-gray-600 dark:text-gray-300 space-y-2">
                    <p>ドライバーは固有能力、ドライブ/ヴォイドライブを持ちます。表面ではドライブ、裏面ではヴォイドライブが使用できます。</p>
                    <p>ターンごとに1度、メインフェイズに任意のタイミングで使用できます。</p>
                    <p>ドライブ、ヴォイドライブは別の扱いなので、例えばドライブを使用したターンにダイブした場合、ヴォイドライブも使用できます。ただし、同じターンにもう一度ダイブして表面に戻ってもドライブは使用できません。</p>
                </div>
            </div>

            {/* 攻撃について */}
            <div id="attack" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">攻撃について</h2>
                <div className="text-gray-600 dark:text-gray-300 space-y-2">
                    <p>縦向き(アンタップ状態)のエージェントは相手のエージェント、もしくは相手自身に攻撃ができます。</p>
                    <p>攻撃を行ったエージェントを横向き(タップ状態)となり、攻撃ができません。</p>
                    <p>相手のエージェントを攻撃した場合、お互いの攻撃力を比較して、低い方が破壊されます。同値の場合は両者とも破壊されます。</p>
                    <p>相手自身を攻撃した場合、攻撃した側が相手の任意のプロテクターを選んで破壊します。相手のプロテクターがない状態で相手自身への攻撃に成功した場合、ゲームに勝利します。ただし相手自身への攻撃は、エージェントの攻撃力が1以上ない場合は何も起きません。</p>
                </div>
            </div>

            {/* ブロックについて */}
            <div id="block" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">ブロックについて</h2>
                <div className="text-gray-600 dark:text-gray-300 space-y-2">
                    <p>相手のエージェントの攻撃時、縦向き(アンタップ状態)の自分のエージェントを横向き(タップ状態)にして、攻撃対象をそのエージェントに移し替えられます。</p>
                    <p>この処理は、自分より速度が高いエージェントに対しては発動できません。</p>
                </div>
            </div>

            {/* 破壊・消失について */}
            <div id="destroy" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">破壊・消失について</h2>
                <div className="text-gray-600 dark:text-gray-300 space-y-2">
                    <p>破壊されたカードは墓地に送られます。</p>
                    <p>消失したカードは墓地ではなくゲーム外に置かれ、基本的にそのゲーム中使うことはありません。</p>
                    <p>墓地のカード及び、消失したカードは指定がない限り表向きで公開され、お互いに確認できます。</p>
                </div>
            </div>

            {/* デッキ切れ・ダイブについて */}
            <div id="dive" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">デッキ切れ・ダイブについて</h2>
                <div className="text-gray-600 dark:text-gray-300 space-y-2">
                    <p>このゲーム最大の特徴として、デッキが切れても基本的に敗北となりません。</p>
                    <p>デッキが切れて、かつカードをデッキから引かなくてはならない状況となった場合、ダイブという処理が発生します。</p>
                    <b>ダイブ</b>
                    <p>墓地とデッキを入れ替えてゲームを続行する処理です。デッキはそのままひっくり返して墓地に、元の墓地はシャッフルして新しいデッキとします。また、それに合わせてドライバーのカードが裏返り、表面状態と裏面状態が切り替わります。ダイブが発生するごとにこの処理は発生するので、表面なら裏面、裏面なら表面に移行します。ゲーム開始時の状態は表面です。</p>
                </div>
            </div>

            {/* ゲームの終了・勝利条件 */}
            <div id="win" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">ゲームの終了・勝利条件</h2>
                <div className="text-gray-600 dark:text-gray-300 space-y-2">
                    <p>相手のプロテクターが0枚の状態で相手に攻撃すると勝利となります。</p>
                    <p>またデッキ切れ時にダイブできない場合(墓地が0枚の場合)は敗北となります。</p>
                </div>
            </div>

            {/* 予備のカードについて */}
            <div id="extra-cards" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 mt-12">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">予備のカードについて</h2>
                <div className="text-gray-600 dark:text-gray-300 space-y-2">
                    <p>各デッキごとに、何枚か予備の入れ替え用カードが含まれています。</p>
                    <p>基本的には最初に含まれる40枚でプレイしていただきますが、この予備のカードと入れ替えてデッキを構築することもできます！</p>
                    <p>デッキの枚数は40枚固定となりますので、予備のカードを使う際は元々含まれているデッキから同じ枚数だけ抜いてください。</p>
                </div>
            </div>

            {/* Q&A・細かいルール */}
            <div id="qa" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">Q&A・細かいルール</h2>
                <div className="text-gray-600 dark:text-gray-300 space-y-4">
                    <div>
                        <b>Q. 効果が同時に発生するなどした場合はどの順番で処理しますか？</b>
                        <p>A. 速度の高い順に処理します。速度が同値の場合はターンプレイヤーの左(古いカード)から順番に処理します。</p>
                    </div>
                </div>
            </div>

            <div className="text-center mt-8">
                <Link
                    to="/"
                    className="inline-block bg-cyan-500 text-white font-semibold py-3 px-6 text-lg md:text-xl rounded-lg shadow-2xl hover:shadow-3xl transition-colors duration-300 hover:bg-cyan-600"
                    style={{
                        boxShadow: '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)',
                    }}
                >
                    <span className="flex items-center justify-center">
                        Back to Home
                        <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                        </svg>
                    </span>
                </Link>
            </div>
        </section>
    );
} 