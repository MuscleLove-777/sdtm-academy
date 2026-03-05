/* ============================================
   SDTM Academy - Level 4: ドキュメント作成
   ============================================ */

const LEVEL4_DATA = {
    id: 4,
    title: "ドキュメント作成",
    icon: "📝",
    description: "SDTM仕様書・aCRF・Define.xml・SDRGの作成方法を学ぶ",
    modules: [
        {
            id: 401,
            title: "SDTM仕様書",
            duration: "30分",
            content: `
<h2>SDTM仕様書とは</h2>
<p><strong>SDTM仕様書（SDTM Specification）</strong>は、SDTMデータセットの設計と作成のための<strong>青写真（Blueprint）</strong>です。プログラマーがデータ変換を行う際のガイドとなり、チーム全体のコミュニケーションツールとしても機能します。</p>

<div class="info-box tip">
<div class="info-box-title">💡 仕様書の重要性</div>
SDTM仕様書は単なるドキュメントではありません。プログラミングの設計図であり、QCの基準であり、規制当局への説明資料の元となります。仕様書の品質がSDTMデータの品質を左右します。
</div>

<h2>仕様書の構成要素</h2>
<p>SDTM仕様書は通常、以下の複数のシートで構成されます。</p>

<h3>1. Dataset-level仕様（データセットレベル）</h3>
<p>各ドメインの概要を一覧にしたシートです。</p>

<table>
<thead>
<tr><th>項目</th><th>説明</th><th>例（DMドメイン）</th></tr>
</thead>
<tbody>
<tr><td><strong>Domain</strong></td><td>ドメインコード（2文字）</td><td>DM</td></tr>
<tr><td><strong>Description</strong></td><td>データセットの説明</td><td>Demographics</td></tr>
<tr><td><strong>Class</strong></td><td>Observation Class</td><td>Special Purpose</td></tr>
<tr><td><strong>Structure</strong></td><td>データの構造</td><td>One record per subject</td></tr>
<tr><td><strong>Key Variables</strong></td><td>ソートキー</td><td>STUDYID, USUBJID</td></tr>
<tr><td><strong>Repeating</strong></td><td>繰り返しの有無</td><td>No</td></tr>
<tr><td><strong>Reference Data</strong></td><td>参照データか否か</td><td>No</td></tr>
</tbody>
</table>

<h3>2. Variable-level仕様（変数レベル）</h3>
<p>各ドメインの全変数を詳細に定義するシートです。これが仕様書の<strong>中核</strong>です。</p>

<table>
<thead>
<tr><th>項目</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td><strong>Variable Name</strong></td><td>変数名（最大8文字）</td></tr>
<tr><td><strong>Label</strong></td><td>変数ラベル（最大40文字）</td></tr>
<tr><td><strong>Type</strong></td><td>データ型（Char / Num）</td></tr>
<tr><td><strong>Length</strong></td><td>変数の長さ</td></tr>
<tr><td><strong>CT / Codelist</strong></td><td>使用するControlled Terminology</td></tr>
<tr><td><strong>Origin</strong></td><td>データの出所（CRF, Derived, Assigned, Protocol）</td></tr>
<tr><td><strong>Source / Derivation</strong></td><td>具体的なマッピングルール・導出方法</td></tr>
<tr><td><strong>Core</strong></td><td>Req / Exp / Perm</td></tr>
<tr><td><strong>Role</strong></td><td>Identifier / Topic / Qualifier / Timing</td></tr>
</tbody>
</table>

<h3>3. Codelist仕様</h3>
<p>使用するControlled Terminologyの一覧と、独自コードリストの定義です。</p>

<h3>4. Derivationアルゴリズム</h3>
<p>複雑な導出変数のロジックを別シートにまとめることもあります。</p>

<h2>DMドメインの仕様書例</h2>

<div class="collapsible">
<div class="collapsible-header">DMドメイン Variable-level仕様の例 <span>▶</span></div>
<div class="collapsible-body">
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>Length</th><th>CT</th><th>Origin</th><th>Source / Derivation</th><th>Core</th></tr>
</thead>
<tbody>
<tr><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>20</td><td></td><td>Assigned</td><td>試験プロトコル番号を設定</td><td>Req</td></tr>
<tr><td>DOMAIN</td><td>Domain Abbreviation</td><td>Char</td><td>2</td><td></td><td>Assigned</td><td>"DM"を設定</td><td>Req</td></tr>
<tr><td>USUBJID</td><td>Unique Subject Identifier</td><td>Char</td><td>30</td><td></td><td>Derived</td><td>STUDYID || "-" || SITEID || "-" || SUBJID</td><td>Req</td></tr>
<tr><td>SUBJID</td><td>Subject Identifier for the Study</td><td>Char</td><td>10</td><td></td><td>CRF</td><td>CRF上の被験者番号</td><td>Req</td></tr>
<tr><td>RFSTDTC</td><td>Subject Reference Start Date/Time</td><td>Char</td><td>19</td><td></td><td>Derived</td><td>治験薬初回投与日（EX.EXSTDTCの最小値）</td><td>Exp</td></tr>
<tr><td>RFENDTC</td><td>Subject Reference End Date/Time</td><td>Char</td><td>19</td><td></td><td>Derived</td><td>治験薬最終投与日（EX.EXENDTCの最大値）</td><td>Exp</td></tr>
<tr><td>SITEID</td><td>Study Site Identifier</td><td>Char</td><td>10</td><td></td><td>CRF</td><td>CRF上の施設番号</td><td>Req</td></tr>
<tr><td>BRTHDTC</td><td>Date/Time of Birth</td><td>Char</td><td>10</td><td></td><td>CRF</td><td>CRF上の生年月日（ISO 8601形式）</td><td>Perm</td></tr>
<tr><td>AGE</td><td>Age</td><td>Num</td><td>8</td><td></td><td>Derived</td><td>同意取得日時点の年齢（年）を算出</td><td>Exp</td></tr>
<tr><td>AGEU</td><td>Age Units</td><td>Char</td><td>6</td><td>AGEU</td><td>Assigned</td><td>"YEARS"を設定</td><td>Exp</td></tr>
<tr><td>SEX</td><td>Sex</td><td>Char</td><td>2</td><td>SEX</td><td>CRF</td><td>CRF上の性別をCDISC CTに変換（男→M、女→F）</td><td>Req</td></tr>
<tr><td>RACE</td><td>Race</td><td>Char</td><td>40</td><td>RACE</td><td>CRF</td><td>CRF上の人種をCDISC CTに変換</td><td>Exp</td></tr>
<tr><td>ARMCD</td><td>Planned Arm Code</td><td>Char</td><td>20</td><td></td><td>Derived</td><td>ランダム化結果に基づき投与群コードを設定</td><td>Req</td></tr>
<tr><td>ARM</td><td>Description of Planned Arm</td><td>Char</td><td>200</td><td></td><td>Derived</td><td>ARMCDに対応する投与群名称を設定</td><td>Req</td></tr>
<tr><td>COUNTRY</td><td>Country</td><td>Char</td><td>3</td><td>COUNTRY</td><td>CRF</td><td>ISO 3166-1 Alpha-3コード（JPN等）</td><td>Req</td></tr>
</tbody>
</table>
</div>
</div>

<h2>AEドメインの仕様書例</h2>

<div class="collapsible">
<div class="collapsible-header">AEドメイン Variable-level仕様の例 <span>▶</span></div>
<div class="collapsible-body">
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>Length</th><th>CT</th><th>Origin</th><th>Source / Derivation</th><th>Core</th></tr>
</thead>
<tbody>
<tr><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>20</td><td></td><td>Assigned</td><td>試験プロトコル番号を設定</td><td>Req</td></tr>
<tr><td>DOMAIN</td><td>Domain Abbreviation</td><td>Char</td><td>2</td><td></td><td>Assigned</td><td>"AE"を設定</td><td>Req</td></tr>
<tr><td>USUBJID</td><td>Unique Subject Identifier</td><td>Char</td><td>30</td><td></td><td>Derived</td><td>STUDYID || "-" || SITEID || "-" || SUBJID</td><td>Req</td></tr>
<tr><td>AESEQ</td><td>Sequence Number</td><td>Num</td><td>8</td><td></td><td>Derived</td><td>被験者内で連番を付与</td><td>Req</td></tr>
<tr><td>AETERM</td><td>Reported Term for the Adverse Event</td><td>Char</td><td>200</td><td></td><td>CRF</td><td>CRF上の有害事象名（原語）</td><td>Req</td></tr>
<tr><td>AEDECOD</td><td>Dictionary-Derived Term</td><td>Char</td><td>200</td><td></td><td>Derived</td><td>MedDRA PTを設定</td><td>Req</td></tr>
<tr><td>AEBODSYS</td><td>Body System or Organ Class</td><td>Char</td><td>200</td><td></td><td>Derived</td><td>MedDRA SOCを設定</td><td>Exp</td></tr>
<tr><td>AESEV</td><td>Severity/Intensity</td><td>Char</td><td>10</td><td>AESEV</td><td>CRF</td><td>CRF上の重症度（MILD/MODERATE/SEVERE）</td><td>Perm</td></tr>
<tr><td>AESER</td><td>Serious Event</td><td>Char</td><td>1</td><td>NY</td><td>CRF</td><td>重篤性フラグ（Y/N）</td><td>Exp</td></tr>
<tr><td>AEREL</td><td>Causality</td><td>Char</td><td>20</td><td></td><td>CRF</td><td>治験薬との因果関係</td><td>Exp</td></tr>
<tr><td>AEACN</td><td>Action Taken with Study Treatment</td><td>Char</td><td>40</td><td>ACN</td><td>CRF</td><td>治験薬に対する処置</td><td>Exp</td></tr>
<tr><td>AEOUT</td><td>Outcome of Adverse Event</td><td>Char</td><td>40</td><td>OUT</td><td>CRF</td><td>有害事象の転帰</td><td>Exp</td></tr>
<tr><td>AESTDTC</td><td>Start Date/Time of Adverse Event</td><td>Char</td><td>19</td><td></td><td>CRF</td><td>CRF上の有害事象発現日（ISO 8601形式）</td><td>Exp</td></tr>
<tr><td>AEENDTC</td><td>End Date/Time of Adverse Event</td><td>Char</td><td>19</td><td></td><td>CRF</td><td>CRF上の有害事象転帰日（ISO 8601形式）</td><td>Exp</td></tr>
</tbody>
</table>
</div>
</div>

<h2>Origin Types（データの出所）</h2>
<table>
<thead>
<tr><th>Origin</th><th>説明</th><th>例</th></tr>
</thead>
<tbody>
<tr><td><strong>CRF</strong></td><td>CRFから直接取得するデータ</td><td>AETERM, SEX, BRTHDTC</td></tr>
<tr><td><strong>Derived</strong></td><td>他の変数から計算・導出するデータ</td><td>AGE, USUBJID, AEDECOD</td></tr>
<tr><td><strong>Assigned</strong></td><td>プログラムで固定値を割り当て</td><td>STUDYID, DOMAIN, AGEU</td></tr>
<tr><td><strong>Protocol</strong></td><td>プロトコルから取得するデータ</td><td>ARMCD, ARM（ランダム化による）</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">⚠️ Origin指定の注意</div>
Define.xmlにもOriginを記載するため、仕様書のOriginとDefine.xmlの整合性を必ず確認しましょう。不整合はバリデーションエラーの原因になります。
</div>

<h2>導出ルール（Derivation）の記述ベストプラクティス</h2>
<ul>
<li><strong>具体的に書く</strong>：「CRFから取得」ではなく「CRF "Adverse Event" ページの "事象名" フィールドから取得」</li>
<li><strong>ロジックを明確に</strong>：条件分岐がある場合はIF-THEN-ELSE形式で記述</li>
<li><strong>参照元を示す</strong>：他ドメインから取得する場合は「EX.EXSTDTCの最小値」のように明記</li>
<li><strong>CT変換を明示</strong>：「CRF値 "男" → CT "M" に変換」のように変換ルールを記載</li>
<li><strong>例外処理を記載</strong>：欠損値やエラーケースの扱いも定義</li>
</ul>

<h3>変更管理</h3>
<p>仕様書は試験中に変更が生じることがあります。以下のベストプラクティスを守りましょう。</p>
<ul>
<li>変更履歴シートを設け、変更日・変更者・変更内容・理由を記録</li>
<li>バージョン番号を管理（v1.0, v1.1, v2.0等）</li>
<li>変更後はDefine.xml・aCRFとの整合性を再確認</li>
<li>チーム内レビューを実施してから確定</li>
</ul>

<h2>仕様書作成ツール</h2>
<table>
<thead>
<tr><th>ツール</th><th>用途</th></tr>
</thead>
<tbody>
<tr><td><strong>Microsoft Excel</strong></td><td>最も一般的。複数シートで管理。テンプレートを活用</td></tr>
<tr><td><strong>Pinnacle 21 Express</strong></td><td>仕様書のバリデーション確認、Define.xml生成の入力元</td></tr>
<tr><td><strong>Pinnacle 21 Enterprise</strong></td><td>チーム共同作業、メタデータリポジトリ管理</td></tr>
</tbody>
</table>

<div class="info-box success">
<div class="info-box-title">✅ 仕様書作成のチェックリスト</div>
・全ドメインのDataset-level情報が記載されているか<br>
・全変数にOriginとSource/Derivationが記載されているか<br>
・Controlled Terminologyの参照が正しいか<br>
・Key VariablesとStructureが正しく定義されているか<br>
・Define.xmlの内容と一致しているか
</div>
`,
            quiz: [
                { id: "q401_1", type: "choice", question: "SDTM仕様書の主な目的として最も適切なものは？", options: ["FDAに直接提出するため", "プログラミングの設計図・コミュニケーションツール", "統計解析の計画書を代替するため", "CRFのデザインを決定するため"], answer: 1, explanation: "SDTM仕様書はプログラマーのための設計図であり、チーム全体のコミュニケーションツールとして機能します。" },
                { id: "q401_2", type: "choice", question: "Variable-level仕様に含まれないものはどれですか？", options: ["Variable Name", "Origin", "統計解析手法", "Core"], answer: 2, explanation: "統計解析手法はSAPやADaM仕様書に記載されるものであり、SDTM仕様書には含まれません。" },
                { id: "q401_3", type: "choice", question: "Origin=Derivedの正しい説明は？", options: ["CRFから直接取得", "他の変数から計算・導出", "プログラムで固定値を割り当て", "プロトコルから取得"], answer: 1, explanation: "Derivedは他の変数やデータから計算・導出されることを意味します。" },
                { id: "q401_4", type: "fill", question: "STUDYIDのOriginは何ですか？（英語で）", answer: "Assigned", explanation: "STUDYIDはプログラムで固定値として割り当てるため、OriginはAssignedです。" },
                { id: "q401_5", type: "choice", question: "仕様書の変更管理で重要でないものは？", options: ["変更履歴の記録", "バージョン番号の管理", "フォントの統一", "Define.xmlとの整合性確認"], answer: 2, explanation: "フォントの統一は内容の品質管理には直接関係しません。変更履歴、バージョン管理、Define.xmlとの整合性が重要です。" },
                { id: "q401_6", type: "choice", question: "Dataset-level仕様の「Structure」に記載する内容は？", options: ["変数の型", "データの構造（例: One record per subject）", "ファイルサイズ", "プログラム言語"], answer: 1, explanation: "StructureにはOne record per subject、One record per event per subject等のデータ構造を記載します。" }
            ]
        },
        {
            id: 402,
            title: "aCRF（Annotated CRF）",
            duration: "30分",
            content: `
<h2>aCRF（Annotated CRF）とは</h2>
<p><strong>aCRF（Annotated Case Report Form）</strong>は、CRFの各フィールドがどのSDTM変数にマッピングされるかを<strong>注釈（アノテーション）</strong>として記載したドキュメントです。</p>

<p>aCRFは<strong>FDA・PMDAへの規制当局提出で必須</strong>のドキュメントであり、レビュアーがデータの出所を理解するための重要なツールです。</p>

<div class="info-box tip">
<div class="info-box-title">💡 aCRFの役割</div>
aCRFは「このCRFフィールドのデータがSDTMのどこに入るか」を示す地図です。FDAレビュアーはaCRFを見て、提出データとCRFの対応関係を確認します。
</div>

<h2>アノテーション形式</h2>
<p>aCRFのアノテーションは<strong>DOMAIN.VARIABLE</strong>の形式で記述します。</p>

<table>
<thead>
<tr><th>CRFフィールド</th><th>アノテーション</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>性別</td><td>DM.SEX</td><td>DMドメインのSEX変数</td></tr>
<tr><td>有害事象名</td><td>AE.AETERM</td><td>AEドメインのAETERM変数</td></tr>
<tr><td>投与量</td><td>EX.EXDOSE</td><td>EXドメインのEXDOSE変数</td></tr>
<tr><td>収縮期血圧</td><td>VS.VSORRES where VSTESTCD='SYSBP'</td><td>条件付きマッピング</td></tr>
<tr><td>検査結果</td><td>LB.LBORRES where LBTESTCD='ALT'</td><td>条件付きマッピング</td></tr>
</tbody>
</table>

<h2>アノテーションルール</h2>

<h3>基本ルール</h3>
<ul>
<li><strong>矢印</strong>：CRFフィールドからアノテーションテキストへ矢印を引く</li>
<li><strong>色</strong>：アノテーションテキストは<strong>青色</strong>で記載するのが標準的</li>
<li><strong>Derived変数</strong>：CRFに直接対応しない導出変数には「<strong>Derived</strong>」と明記</li>
<li><strong>SUPP変数</strong>：Supplemental Qualifierへのマッピングは「<strong>SUPPAE.QNAM='xxxx'</strong>」のように記載</li>
</ul>

<h3>キープリンシプル</h3>
<table>
<thead>
<tr><th>原則</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td><strong>全フィールドをアノテーション</strong></td><td>SDTMにマッピングされる全CRFフィールドに注釈を付ける</td></tr>
<tr><td><strong>CTの表示</strong></td><td>Controlled Terminologyを使用する場合、CRF値とCT値の変換を示す</td></tr>
<tr><td><strong>Timing変数の注釈</strong></td><td>日付フィールドには対応するSDTMタイミング変数（--STDTC等）を記載</td></tr>
<tr><td><strong>Not Submitted</strong></td><td>SDTMにマッピングしないフィールドには「Not Submitted」と記載</td></tr>
<tr><td><strong>一貫性</strong></td><td>全ページで統一されたフォーマット・命名規則を使用</td></tr>
</tbody>
</table>

<h2>Demographics CRFのアノテーション例</h2>

<div class="collapsible">
<div class="collapsible-header">Demographics CRFアノテーション詳細 <span>▶</span></div>
<div class="collapsible-body">
<table>
<thead>
<tr><th>CRFフィールド</th><th>アノテーション</th><th>備考</th></tr>
</thead>
<tbody>
<tr><td>被験者番号</td><td>DM.SUBJID</td><td>USUBJIDの構成要素にもなる</td></tr>
<tr><td>施設番号</td><td>DM.SITEID</td><td></td></tr>
<tr><td>生年月日</td><td>DM.BRTHDTC</td><td>ISO 8601形式に変換</td></tr>
<tr><td>年齢</td><td>DM.AGE<br>DM.AGEU = 'YEARS'</td><td>単位はAGEUに設定</td></tr>
<tr><td>性別（男/女）</td><td>DM.SEX<br>CT: 男=M, 女=F</td><td>CDISC CT (SEX)を使用</td></tr>
<tr><td>人種</td><td>DM.RACE<br>CT: RACE codelist</td><td>CDISC CT (RACE)を使用</td></tr>
<tr><td>同意取得日</td><td>DM.DMDTC</td><td>ISO 8601形式</td></tr>
<tr><td>投与群名</td><td>DM.ARM, DM.ARMCD<br>Derived from randomization</td><td>ランダム化結果から導出</td></tr>
</tbody>
</table>
</div>
</div>

<h2>AE CRFのアノテーション例</h2>

<div class="collapsible">
<div class="collapsible-header">AE CRFアノテーション詳細 <span>▶</span></div>
<div class="collapsible-body">
<table>
<thead>
<tr><th>CRFフィールド</th><th>アノテーション</th><th>備考</th></tr>
</thead>
<tbody>
<tr><td>有害事象名</td><td>AE.AETERM</td><td>CRF報告用語をそのまま格納</td></tr>
<tr><td>（辞書コード化）</td><td>AE.AEDECOD<br>Derived: MedDRA PT</td><td>CRFには無い。辞書コード化で導出</td></tr>
<tr><td>（器官別大分類）</td><td>AE.AEBODSYS<br>Derived: MedDRA SOC</td><td>CRFには無い。辞書コード化で導出</td></tr>
<tr><td>発現日</td><td>AE.AESTDTC</td><td>ISO 8601形式に変換</td></tr>
<tr><td>転帰日</td><td>AE.AEENDTC</td><td>ISO 8601形式に変換</td></tr>
<tr><td>重症度（軽度/中等度/重度）</td><td>AE.AESEV<br>CT: 軽度=MILD, 中等度=MODERATE, 重度=SEVERE</td><td>CDISC CT (AESEV)を使用</td></tr>
<tr><td>重篤性（はい/いいえ）</td><td>AE.AESER<br>CT: はい=Y, いいえ=N</td><td>CDISC CT (NY)を使用</td></tr>
<tr><td>因果関係</td><td>AE.AEREL</td><td></td></tr>
<tr><td>処置</td><td>AE.AEACN<br>CT: ACN codelist</td><td>CDISC CT (ACN)を使用</td></tr>
<tr><td>転帰</td><td>AE.AEOUT<br>CT: OUT codelist</td><td>CDISC CT (OUT)を使用</td></tr>
<tr><td>治験責任医師コメント</td><td>SUPPAE.QNAM='AECOMT'</td><td>SUPP変数として格納</td></tr>
</tbody>
</table>
</div>
</div>

<h2>作成ツール</h2>
<table>
<thead>
<tr><th>ツール</th><th>用途</th></tr>
</thead>
<tbody>
<tr><td><strong>Adobe Acrobat Pro</strong></td><td>PDFにコメント・テキストボックスでアノテーションを追加。最も標準的</td></tr>
<tr><td><strong>Adobe Acrobat Reader</strong></td><td>閲覧・簡易コメント（Pro推奨）</td></tr>
</tbody>
</table>

<h2>よくある間違い</h2>

<div class="info-box warning">
<div class="info-box-title">⚠️ aCRF作成時の注意点</div>
<strong>1. アノテーション漏れ</strong>：マッピングされるフィールドにアノテーションが無い<br>
<strong>2. ドメイン間違い</strong>：変数を誤ったドメインにマッピング（例：併用薬をAEにマッピング）<br>
<strong>3. 仕様書との不整合</strong>：aCRFと仕様書で異なるマッピングが記載されている<br>
<strong>4. CT変換の未記載</strong>：CRF値からCDISC CT値への変換ルールが書かれていない<br>
<strong>5. SUPP注釈の不備</strong>：Supplemental Qualifierへのマッピングが不明確<br>
<strong>6. Derived変数の未記載</strong>：導出変数が注釈されていない
</div>

<div class="info-box success">
<div class="info-box-title">✅ aCRF品質チェック</div>
・仕様書のOrigin=CRFの全変数がaCRFに注釈されているか<br>
・Derived変数がaCRFに適切に記載されているか<br>
・CT変換が全て明記されているか<br>
・全ページが漏れなくアノテーションされているか<br>
・仕様書・Define.xmlとの一貫性が保たれているか
</div>
`,
            quiz: [
                { id: "q402_1", type: "choice", question: "aCRFのアノテーション形式として正しいものは？", options: ["VARIABLE(DOMAIN)", "DOMAIN-VARIABLE", "DOMAIN.VARIABLE", "VARIABLE_DOMAIN"], answer: 2, explanation: "aCRFのアノテーションはDOMAIN.VARIABLE形式（例：DM.SEX）で記述します。" },
                { id: "q402_2", type: "choice", question: "aCRFでアノテーションテキストに使う標準的な色は？", options: ["赤", "青", "緑", "黒"], answer: 1, explanation: "aCRFのアノテーションは青色で記載するのが標準的です。" },
                { id: "q402_3", type: "choice", question: "CRFに対応するフィールドがない導出変数には何と記載しますか？", options: ["N/A", "Derived", "Not Collected", "Computed"], answer: 1, explanation: "CRFに直接対応しない導出変数にはDerivedと明記します。" },
                { id: "q402_4", type: "choice", question: "SDTMにマッピングしないCRFフィールドに記載する注釈は？", options: ["Excluded", "Not Submitted", "Ignored", "Skipped"], answer: 1, explanation: "SDTMにマッピングしないフィールドにはNot Submittedと記載します。" },
                { id: "q402_5", type: "fill", question: "aCRFの作成に最も標準的に使われるツールは？（英語で）", answer: "Adobe Acrobat Pro", explanation: "Adobe Acrobat ProでPDFにアノテーションを追加するのが最も標準的な方法です。" },
                { id: "q402_6", type: "choice", question: "aCRFでSUPP変数のアノテーション形式として正しいものは？", options: ["SUPP.DOMAIN.VARIABLE", "SUPPAE.QNAM='変数名'", "AE.SUPP.VARIABLE", "SUPP(AE, VARIABLE)"], answer: 1, explanation: "SUPP変数はSUPPAE.QNAM='xxxx'のように、SUPPドメインのQNAMで指定します。" }
            ]
        },
        {
            id: 403,
            title: "Define.xml",
            duration: "35分",
            content: `
<h2>Define.xmlとは</h2>
<p><strong>Define.xml（Define-XML）</strong>は、SDTMデータセットのメタデータを<strong>機械可読（machine-readable）</strong>形式で記述したXMLファイルです。データセットの構造、変数の定義、コードリスト、導出方法などを標準的な形式で文書化します。</p>

<p>現在使用されるバージョンは<strong>Define-XML v2.0</strong>および<strong>v2.1</strong>です。FDA提出では必須のドキュメントです。</p>

<div class="info-box tip">
<div class="info-box-title">💡 Define.xmlの位置づけ</div>
Define.xmlはSDTM仕様書の「機械可読版」です。人間が読む仕様書の内容をXML形式で構造化することで、バリデーションツール（Pinnacle 21等）が自動的にデータの整合性を確認できます。
</div>

<h2>Define-XMLの主要構造</h2>
<p>Define.xmlは階層的なXML構造を持っています。</p>

<table>
<thead>
<tr><th>要素</th><th>説明</th><th>対応する仕様書内容</th></tr>
</thead>
<tbody>
<tr><td><strong>StudyOID</strong></td><td>試験の識別子</td><td>試験番号</td></tr>
<tr><td><strong>MetaDataVersion</strong></td><td>メタデータのバージョン</td><td>仕様書バージョン</td></tr>
<tr><td><strong>ItemGroupDef</strong></td><td>データセット（ドメイン）の定義</td><td>Dataset-level仕様</td></tr>
<tr><td><strong>ItemDef</strong></td><td>変数の定義</td><td>Variable-level仕様</td></tr>
<tr><td><strong>CodeList</strong></td><td>コードリストの定義</td><td>Codelist仕様</td></tr>
<tr><td><strong>MethodDef</strong></td><td>導出方法の定義</td><td>Derivationアルゴリズム</td></tr>
<tr><td><strong>CommentDef</strong></td><td>コメントの定義</td><td>変数に関する補足説明</td></tr>
<tr><td><strong>WhereClauseDef</strong></td><td>Value Level Metadataの条件定義</td><td>条件付き変数定義</td></tr>
<tr><td><strong>leaf</strong></td><td>外部ドキュメントへの参照</td><td>aCRF等への参照リンク</td></tr>
</tbody>
</table>

<h2>XML構造の例</h2>

<h3>ItemGroupDef（データセット定義）</h3>
<div class="code-block"><div class="code-block-header"><span class="code-lang">XML</span></div><pre><code class="language-xml">&lt;ItemGroupDef OID="IG.DM"
              Name="DM"
              Repeating="No"
              IsReferenceData="No"
              SASDatasetName="DM"
              Domain="DM"
              Purpose="Tabulation"
              def:Structure="One record per subject"
              def:Class="Special Purpose"
              def:ArchiveLocationID="LF.DM"
              def:CommentOID="COM.DM"&gt;
    &lt;Description&gt;
        &lt;TranslatedText xml:lang="en"&gt;Demographics&lt;/TranslatedText&gt;
    &lt;/Description&gt;
    &lt;ItemRef ItemOID="IT.DM.STUDYID" OrderNumber="1" Mandatory="Yes" KeySequence="1" /&gt;
    &lt;ItemRef ItemOID="IT.DM.DOMAIN"  OrderNumber="2" Mandatory="Yes" /&gt;
    &lt;ItemRef ItemOID="IT.DM.USUBJID" OrderNumber="3" Mandatory="Yes" KeySequence="2" /&gt;
    &lt;ItemRef ItemOID="IT.DM.SUBJID"  OrderNumber="4" Mandatory="Yes" /&gt;
    &lt;ItemRef ItemOID="IT.DM.SEX"     OrderNumber="5" Mandatory="Yes" /&gt;
    &lt;ItemRef ItemOID="IT.DM.AGE"     OrderNumber="6" Mandatory="No"
             MethodOID="MT.AGE" /&gt;
    &lt;!-- 以下省略 --&gt;
&lt;/ItemGroupDef&gt;</code></pre></div>

<h3>ItemDef（変数定義）</h3>
<div class="code-block"><div class="code-block-header"><span class="code-lang">XML</span></div><pre><code class="language-xml">&lt;ItemDef OID="IT.DM.SEX"
         Name="SEX"
         DataType="text"
         Length="2"
         SASFieldName="SEX"
         def:DisplayFormat=""&gt;
    &lt;Description&gt;
        &lt;TranslatedText xml:lang="en"&gt;Sex&lt;/TranslatedText&gt;
    &lt;/Description&gt;
    &lt;CodeListRef CodeListOID="CL.SEX" /&gt;
    &lt;def:Origin Type="CRF"&gt;
        &lt;def:DocumentRef leafID="LF.aCRF"&gt;
            &lt;def:PDFPageRef PageRefs="5" Type="PhysicalRef" /&gt;
        &lt;/def:DocumentRef&gt;
    &lt;/def:Origin&gt;
&lt;/ItemDef&gt;

&lt;ItemDef OID="IT.DM.AGE"
         Name="AGE"
         DataType="integer"
         SASFieldName="AGE"&gt;
    &lt;Description&gt;
        &lt;TranslatedText xml:lang="en"&gt;Age&lt;/TranslatedText&gt;
    &lt;/Description&gt;
    &lt;def:Origin Type="Derived" /&gt;
&lt;/ItemDef&gt;</code></pre></div>

<h3>CodeList（コードリスト定義）</h3>
<div class="code-block"><div class="code-block-header"><span class="code-lang">XML</span></div><pre><code class="language-xml">&lt;CodeList OID="CL.SEX"
          Name="SEX"
          DataType="text"&gt;
    &lt;CodeListItem CodedValue="M" OrderNumber="1"&gt;
        &lt;Decode&gt;
            &lt;TranslatedText xml:lang="en"&gt;Male&lt;/TranslatedText&gt;
        &lt;/Decode&gt;
    &lt;/CodeListItem&gt;
    &lt;CodeListItem CodedValue="F" OrderNumber="2"&gt;
        &lt;Decode&gt;
            &lt;TranslatedText xml:lang="en"&gt;Female&lt;/TranslatedText&gt;
        &lt;/Decode&gt;
    &lt;/CodeListItem&gt;
    &lt;CodeListItem CodedValue="U" OrderNumber="3"&gt;
        &lt;Decode&gt;
            &lt;TranslatedText xml:lang="en"&gt;Unknown&lt;/TranslatedText&gt;
        &lt;/Decode&gt;
    &lt;/CodeListItem&gt;
&lt;/CodeList&gt;</code></pre></div>

<h3>MethodDef（導出方法定義）</h3>
<div class="code-block"><div class="code-block-header"><span class="code-lang">XML</span></div><pre><code class="language-xml">&lt;MethodDef OID="MT.AGE"
           Name="Algorithm for AGE"
           Type="Computation"&gt;
    &lt;Description&gt;
        &lt;TranslatedText xml:lang="en"&gt;
            Age is calculated as the integer part of
            (informed consent date - date of birth) / 365.25.
        &lt;/TranslatedText&gt;
    &lt;/Description&gt;
&lt;/MethodDef&gt;</code></pre></div>

<h2>Value Level Metadata（VLM）</h2>
<p><strong>Value Level Metadata</strong>は、同じ変数が条件によって異なる属性（型、長さ、コードリスト等）を持つ場合に使用します。</p>

<h3>VLMが必要な場面</h3>
<ul>
<li><strong>LBドメイン</strong>：検査項目ごとに結果の型・単位・コードリストが異なる</li>
<li><strong>VSドメイン</strong>：バイタルサイン項目ごとに結果の範囲・単位が異なる</li>
<li><strong>FAドメイン</strong>：各質問項目で回答のコードリストが異なる</li>
</ul>

<h3>LBドメインのVLM例</h3>
<div class="code-block"><div class="code-block-header"><span class="code-lang">XML</span></div><pre><code class="language-xml">&lt;!-- LBORRES変数に対するVLM定義 --&gt;
&lt;ItemDef OID="IT.LB.LBORRES"
         Name="LBORRES"
         DataType="text"
         Length="200"
         SASFieldName="LBORRES"&gt;
    &lt;Description&gt;
        &lt;TranslatedText xml:lang="en"&gt;Result or Finding in Original Units&lt;/TranslatedText&gt;
    &lt;/Description&gt;
    &lt;def:Origin Type="CRF" /&gt;
&lt;/ItemDef&gt;

&lt;!-- ALTの場合のVLM --&gt;
&lt;ItemDef OID="IT.LB.LBORRES.ALT"
         Name="LBORRES"
         DataType="float"
         SignificantDigits="1"
         SASFieldName="LBORRES"&gt;
    &lt;Description&gt;
        &lt;TranslatedText xml:lang="en"&gt;Result or Finding in Original Units for ALT&lt;/TranslatedText&gt;
    &lt;/Description&gt;
    &lt;def:Origin Type="CRF" /&gt;
&lt;/ItemDef&gt;

&lt;!-- WhereClauseDefで条件を定義 --&gt;
&lt;def:WhereClauseDef OID="WC.LB.LBORRES.ALT"&gt;
    &lt;RangeCheck SoftHard="Soft" def:ItemOID="IT.LB.LBTESTCD" Comparator="EQ"&gt;
        &lt;CheckValue&gt;ALT&lt;/CheckValue&gt;
    &lt;/RangeCheck&gt;
&lt;/def:WhereClauseDef&gt;</code></pre></div>

<div class="info-box tip">
<div class="info-box-title">💡 VLMのポイント</div>
VLMは特にFindingsクラスのドメイン（LB, VS, EG等）で重要です。--TESTCD変数の値によって--ORRES等の属性が変わる場合に、WhereClauseDefを使って条件を定義します。
</div>

<h2>Define.xml作成ツール</h2>
<table>
<thead>
<tr><th>ツール</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td><strong>Pinnacle 21 Express</strong></td><td>Excelテンプレートからdefine.xmlを自動生成。最も一般的</td></tr>
<tr><td><strong>SAS Clinical Standards Toolkit</strong></td><td>SASプログラムからdefine.xmlを生成</td></tr>
<tr><td><strong>手動作成</strong></td><td>XMLエディタで直接記述（非推奨、エラーが発生しやすい）</td></tr>
</tbody>
</table>

<h2>Define.xmlのバリデーション</h2>
<p>Define.xmlにもバリデーションルールがあり、Pinnacle 21でチェックできます。</p>

<table>
<thead>
<tr><th>チェック項目</th><th>内容</th></tr>
</thead>
<tbody>
<tr><td>XML構文</td><td>Well-formed XMLかどうか</td></tr>
<tr><td>スキーマ準拠</td><td>Define-XML v2.0/2.1スキーマに準拠しているか</td></tr>
<tr><td>データとの整合</td><td>実際のXPTデータセットとの整合性</td></tr>
<tr><td>リンクの有効性</td><td>aCRF等への参照リンクが有効か</td></tr>
<tr><td>コードリスト</td><td>CT参照が正しいか</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">⚠️ Define.xmlの一般的な問題</div>
<strong>1.</strong> 実データに存在する変数がDefine.xmlに定義されていない<br>
<strong>2.</strong> Define.xmlで定義した変数が実データに存在しない<br>
<strong>3.</strong> データ型やLengthがDefine.xmlとXPTで不一致<br>
<strong>4.</strong> aCRFへのページ参照（PDFPageRef）が間違っている<br>
<strong>5.</strong> MethodDefの記述が実際の導出ロジックと一致しない
</div>

<div class="info-box success">
<div class="info-box-title">✅ Define.xml品質チェック</div>
・Pinnacle 21でバリデーションエラー0を目指す<br>
・スタイルシートを適用してブラウザで表示し、目視確認する<br>
・仕様書・aCRFとの一貫性を確認<br>
・全CodeListが正しく定義されているか確認<br>
・VLMが必要なドメインで適切に定義されているか確認
</div>
`,
            quiz: [
                { id: "q403_1", type: "choice", question: "Define.xmlの主な目的は？", options: ["CRFのデザイン", "SDTMメタデータの機械可読な記述", "統計解析の計画", "症例報告書の作成"], answer: 1, explanation: "Define.xmlはSDTMデータセットのメタデータを機械可読（XML）形式で記述したドキュメントです。" },
                { id: "q403_2", type: "choice", question: "Define.xmlでデータセット（ドメイン）を定義する要素は？", options: ["ItemDef", "ItemGroupDef", "CodeList", "MethodDef"], answer: 1, explanation: "ItemGroupDefがデータセット（ドメイン）の定義を記述する要素です。" },
                { id: "q403_3", type: "choice", question: "Define.xmlで導出方法を定義する要素は？", options: ["ItemDef", "CodeList", "MethodDef", "CommentDef"], answer: 2, explanation: "MethodDefが導出方法（Derivation Algorithm）を定義する要素です。" },
                { id: "q403_4", type: "choice", question: "Value Level Metadata（VLM）が最も必要なドメインは？", options: ["DM", "AE", "LB", "DS"], answer: 2, explanation: "LBドメインは検査項目ごとに結果の型・単位等が異なるため、VLMが最も必要です。" },
                { id: "q403_5", type: "fill", question: "Define.xmlでコードリストを定義する要素名は？（英語で）", answer: "CodeList", explanation: "CodeList要素でCDISC CT等のコードリストを定義します。" },
                { id: "q403_6", type: "choice", question: "Define.xmlの生成に最も一般的に使われるツールは？", options: ["SAS Base", "Pinnacle 21 Express", "Microsoft Word", "R Studio"], answer: 1, explanation: "Pinnacle 21 ExpressのExcelテンプレートからdefine.xmlを自動生成するのが最も一般的です。" }
            ]
        },
        {
            id: 404,
            title: "SDRG（Reviewer's Guide）",
            duration: "25分",
            content: `
<h2>SDRGとは</h2>
<p><strong>SDRG（Study Data Reviewer's Guide）</strong>は、FDAレビュアーがSDTMデータを理解・レビューするための<strong>ガイドドキュメント</strong>です。提出データの全体像、特殊な処理、標準からの逸脱等を説明します。</p>

<p>SDRGは<strong>PDF形式</strong>で提出し、PhUSE（Pharmaceutical Users Software Exchange）が提供する<strong>テンプレート</strong>に基づいて作成します。</p>

<div class="info-box tip">
<div class="info-box-title">💡 SDRGの重要性</div>
SDRGはFDAレビュアーへの「手紙」のようなものです。レビュアーはまずSDRGを読んでデータの全体像を把握し、その後に個別のデータを確認します。SDRGの品質がレビューの効率と正確性に直結します。
</div>

<h2>SDRGテンプレートの構成</h2>

<table>
<thead>
<tr><th>セクション</th><th>内容</th></tr>
</thead>
<tbody>
<tr><td><strong>1. Introduction</strong></td><td>試験の概要、目的、対象疾患、開発相</td></tr>
<tr><td><strong>2. Submission Structure</strong></td><td>提出パッケージのフォルダ構成・ファイル一覧</td></tr>
<tr><td><strong>3. SDTM IG Version</strong></td><td>使用したSDTM IGのバージョン</td></tr>
<tr><td><strong>4. Controlled Terminology</strong></td><td>使用したCDISC CTのバージョン</td></tr>
<tr><td><strong>5. Domain-specific Information</strong></td><td>各ドメインの詳細情報・特殊な処理の説明</td></tr>
<tr><td><strong>6. Trial Design</strong></td><td>Trial Designドメイン（TA, TE, TV, TI, TS）の説明</td></tr>
<tr><td><strong>7. Subject Data</strong></td><td>被験者データの概要、データカット情報</td></tr>
<tr><td><strong>8. Data Conformance</strong></td><td>Pinnacle 21バリデーション結果の説明</td></tr>
<tr><td><strong>9. References</strong></td><td>参考文献・関連ドキュメント</td></tr>
</tbody>
</table>

<h3>セクション詳細</h3>

<h3>1. Introduction</h3>
<p>試験の基本情報を簡潔に記載します。</p>
<ul>
<li>試験番号・試験名称</li>
<li>対象疾患・適応症</li>
<li>開発相（Phase I/II/III/IV）</li>
<li>試験デザイン（二重盲検、ランダム化等）</li>
<li>投与群の構成</li>
</ul>

<h3>5. Domain-specific Information</h3>
<p>このセクションが最も重要です。各ドメインについて以下を記載します。</p>
<ul>
<li>ドメインの概要・目的</li>
<li>使用した非標準変数とその理由</li>
<li>特殊なマッピングルールの説明</li>
<li>SUPP--ドメインの内容と理由</li>
<li>SDTM IGからの逸脱とその正当化</li>
</ul>

<h3>8. Data Conformance</h3>
<p>Pinnacle 21のバリデーション結果を要約し、残存するIssueの説明を記載します。</p>

<div class="collapsible">
<div class="collapsible-header">Data Conformanceセクションの記載例 <span>▶</span></div>
<div class="collapsible-body">
<table>
<thead>
<tr><th>Rule ID</th><th>Severity</th><th>Message</th><th>Explanation</th></tr>
</thead>
<tbody>
<tr><td>SD0083</td><td>Error</td><td>AEENDTC is before AESTDTC</td><td>被験者S-001-005のAE#3は、CRFにおいて転帰日が発現日より前に記録されています。Medical Monitorに確認済みで、原データの通り保持しています。</td></tr>
<tr><td>SD1001</td><td>Warning</td><td>Variable value not found in codelist</td><td>AESEV='LIFE THREATENING'はCDISC CT (AESEV)に無い値ですが、プロトコルで定義された重症度区分に基づいています。</td></tr>
<tr><td>SD0026</td><td>Warning</td><td>Non-standard variable</td><td>SUPPAE.QNAM='AECOMT'は治験責任医師のコメントを格納するための非標準変数です。aCRFの該当フィールドに対応します。</td></tr>
</tbody>
</table>
</div>
</div>

<h2>SDRGの記述Tips</h2>

<h3>良い記述の原則</h3>
<ul>
<li><strong>具体的に書く</strong>：「一部のデータに問題がある」ではなく「被験者S-001-005のAE#3で日付の逆転が発生」</li>
<li><strong>逸脱を説明する</strong>：SDTM IGからの逸脱がある場合は理由と正当化を明記</li>
<li><strong>非標準変数を説明する</strong>：SUPP変数やカスタム変数の目的・内容を詳細に記述</li>
<li><strong>P21結果を解説する</strong>：残存するError/Warningの各々について原因と対応を説明</li>
<li><strong>読みやすくする</strong>：表やリストを活用し、冗長な文章を避ける</li>
</ul>

<div class="info-box warning">
<div class="info-box-title">⚠️ FDAレビュアーが注目するポイント</div>
<strong>1. Data Conformance</strong>：P21エラーが適切に説明されているか<br>
<strong>2. 非標準変数</strong>：標準のSDTM IG変数で対応できなかった理由は何か<br>
<strong>3. Trial Design</strong>：試験デザインが正しく反映されているか<br>
<strong>4. 一貫性</strong>：SDRG、Define.xml、aCRF、実データ間に矛盾がないか<br>
<strong>5. 逸脱の正当化</strong>：標準からの逸脱に合理的な理由があるか
</div>

<h2>よくある間違い</h2>

<table>
<thead>
<tr><th>間違い</th><th>正しい対応</th></tr>
</thead>
<tbody>
<tr><td>P21エラーを無視する</td><td>全てのError/Warningに説明を記載する</td></tr>
<tr><td>テンプレートのセクションを空のままにする</td><td>該当なしの場合も「N/A」と記載し、理由を補足</td></tr>
<tr><td>抽象的な説明に留める</td><td>具体的なドメイン名・変数名・被験者IDを記載</td></tr>
<tr><td>他のドキュメントとの不整合</td><td>Define.xml・aCRF・仕様書と内容を統一</td></tr>
<tr><td>SDTM IGバージョンの未記載</td><td>使用したIG・CTのバージョンを明記</td></tr>
<tr><td>テンプレートの古いバージョンを使用</td><td>PhUSEの最新SDRGテンプレートを使用</td></tr>
</tbody>
</table>

<div class="info-box success">
<div class="info-box-title">✅ SDRG品質チェック</div>
・PhUSEテンプレートの全セクションが記載されているか<br>
・SDTM IGとCTのバージョンが明記されているか<br>
・全ドメインのDomain-specific情報が記載されているか<br>
・P21バリデーション結果の全Issue（Error/Warning）に説明があるか<br>
・非標準変数・SUPP変数が全て説明されているか<br>
・Define.xml・aCRFとの一貫性が保たれているか
</div>
`,
            quiz: [
                { id: "q404_1", type: "choice", question: "SDRGの主な目的は？", options: ["プログラマーへの指示書", "FDAレビュアーがデータを理解するためのガイド", "統計解析の結果報告", "CRFデザインの説明"], answer: 1, explanation: "SDRGはFDAレビュアーがSDTMデータを理解・レビューするためのガイドドキュメントです。" },
                { id: "q404_2", type: "choice", question: "SDRGテンプレートを提供している組織は？", options: ["CDISC", "FDA", "PhUSE", "NCI"], answer: 2, explanation: "PhUSE（Pharmaceutical Users Software Exchange）がSDRGテンプレートを提供しています。" },
                { id: "q404_3", type: "choice", question: "Data Conformanceセクションに記載する主な内容は？", options: ["試験デザインの説明", "被験者数の集計", "Pinnacle 21バリデーション結果の説明", "統計解析手法の概要"], answer: 2, explanation: "Data ConformanceセクションにはPinnacle 21のバリデーション結果と残存Issueの説明を記載します。" },
                { id: "q404_4", type: "choice", question: "SDRGで最も重要なセクションはどれですか？", options: ["Introduction", "Submission Structure", "Domain-specific Information", "References"], answer: 2, explanation: "Domain-specific Informationが最も重要で、各ドメインの特殊な処理や逸脱等を詳しく説明します。" },
                { id: "q404_5", type: "fill", question: "SDRGの提出形式は？（英語3文字）", answer: "PDF", explanation: "SDRGはPDF形式で規制当局に提出します。" },
                { id: "q404_6", type: "choice", question: "SDRGに記載すべきでないものはどれですか？", options: ["SDTM IGバージョン", "非標準変数の説明", "個々の被験者の全データ一覧", "P21エラーの説明"], answer: 2, explanation: "個々の被験者の全データ一覧はSDRGには記載しません。SDRGはデータの概要と特殊な点を説明するドキュメントです。" }
            ]
        }
    ]
};
