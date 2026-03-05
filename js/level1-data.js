/* ============================================
   SDTM Academy - Level 1: SDTM基礎
   ============================================ */

const LEVEL1_DATA = {
    id: 1,
    title: "SDTM基礎",
    icon: "📚",
    description: "CDISC標準とSDTMの基本概念を学ぶ",
    modules: [
        {
            id: 101,
            title: "CDISC概要",
            duration: "15分",
            content: `
<h2>CDISCとは</h2>
<p><strong>CDISC（Clinical Data Interchange Standards Consortium）</strong>は、臨床試験データの取得・交換・提出・保存のための国際標準を開発する非営利団体です。1997年に設立され、製薬企業・規制当局・CRO・アカデミアなど、世界中の組織が参加しています。</p>

<div class="info-box tip">
<div class="info-box-title">💡 なぜ標準化が重要なのか</div>
各企業が独自フォーマットでデータを提出していた時代は、FDAのレビューに膨大な時間がかかっていました。CDISCの標準化により、データの品質向上・レビュー効率化・試験間の比較が可能になりました。
</div>

<h2>CDISC標準の全体像</h2>
<table>
<thead>
<tr><th>標準名</th><th>正式名称</th><th>用途</th><th>段階</th></tr>
</thead>
<tbody>
<tr><td><strong>CDASH</strong></td><td>Clinical Data Acquisition Standards Harmonization</td><td>CRFのデータ収集標準</td><td>データ収集</td></tr>
<tr><td><strong>SDTM</strong></td><td>Study Data Tabulation Model</td><td>試験データの集計・表形式化</td><td>データ集計</td></tr>
<tr><td><strong>ADaM</strong></td><td>Analysis Data Model</td><td>統計解析用データセット</td><td>解析</td></tr>
<tr><td><strong>SEND</strong></td><td>Standard for Exchange of Nonclinical Data</td><td>非臨床試験データ</td><td>非臨床</td></tr>
<tr><td><strong>Define-XML</strong></td><td>Data Definition Specification</td><td>データセットのメタデータ記述</td><td>メタデータ</td></tr>
<tr><td><strong>ODM</strong></td><td>Operational Data Model</td><td>臨床データの交換フォーマット</td><td>データ交換</td></tr>
</tbody>
</table>

<h2>データの流れ</h2>
<ol>
<li><strong>データ収集（CDASH）</strong>：CRFで被験者のデータを収集</li>
<li><strong>データ集計（SDTM）</strong>：収集データをSDTM形式に変換・標準化</li>
<li><strong>解析データ作成（ADaM）</strong>：SDTMから統計解析用データセットを作成</li>
<li><strong>規制当局提出</strong>：SDTM + ADaM + Define-XML + aCRF + SDRGを一式で提出</li>
</ol>

<h2>規制要件</h2>
<h3>FDA（米国食品医薬品局）</h3>
<p>FDAは<strong>2016年12月</strong>以降、NDA/BLAでCDISC標準によるデータ提出を<strong>義務化</strong>しました。</p>

<h3>PMDA（日本）</h3>
<p>PMDAも<strong>2020年4月</strong>以降、新医薬品の承認申請にCDISC標準のデータ提出を原則求めています。</p>

<div class="info-box warning">
<div class="info-box-title">⚠️ 重要</div>
規制当局が求めるSDTM IGやCTのバージョンは定期的に更新されます。申請前に必ずFDA Data Standards CatalogやPMDAの通知を確認しましょう。
</div>
`,
            quiz: [
                { id: "q101_1", type: "choice", question: "CDISCの正式名称は？", options: ["Clinical Data Interchange Standards Consortium", "Clinical Data Integration Standards Committee", "Clinical Database Information Standards Consortium", "Clinical Data Interface Standards Council"], answer: 0, explanation: "CDISCはClinical Data Interchange Standards Consortiumの略です。" },
                { id: "q101_2", type: "choice", question: "CRFデータ収集に関する標準はどれですか？", options: ["SDTM", "CDASH", "ADaM", "SEND"], answer: 1, explanation: "CDASHはCRFのデータ収集標準です。" },
                { id: "q101_3", type: "choice", question: "SDTMから作成される統計解析用データの標準は？", options: ["CDASH", "Define-XML", "ADaM", "ODM"], answer: 2, explanation: "ADaMはSDTMから統計解析用データセットを作成するための標準です。" },
                { id: "q101_4", type: "choice", question: "FDAがCDISC標準を義務化したのは何年？", options: ["2014年", "2015年", "2016年", "2018年"], answer: 2, explanation: "FDAは2016年12月以降にCDISC標準を義務化しました。" },
                { id: "q101_5", type: "fill", question: "非臨床試験データの標準の略称は？", answer: "SEND", explanation: "SENDは非臨床試験データの標準です。" }
            ]
        },
        {
            id: 102,
            title: "SDTMとは",
            duration: "20分",
            content: `
<h2>SDTM（Study Data Tabulation Model）とは</h2>
<p><strong>SDTM</strong>は、臨床試験で収集されたデータを<strong>標準的な表形式（tabulation）</strong>に整理するためのモデルです。</p>

<p>SDTMは以下の2つの文書で構成されます：</p>
<ul>
<li><strong>SDTM（モデル本体）</strong>：データの一般構造を定義</li>
<li><strong>SDTM IG（Implementation Guide）</strong>：具体的なドメイン・変数の実装ガイドライン</li>
</ul>

<h2>SDTM IGのバージョン履歴</h2>
<table>
<thead><tr><th>バージョン</th><th>リリース年</th><th>主な特徴</th></tr></thead>
<tbody>
<tr><td>SDTM IG 3.1.2</td><td>2008年</td><td>長年の標準バージョン</td></tr>
<tr><td>SDTM IG 3.2</td><td>2013年</td><td>Associated Personsクラス追加</td></tr>
<tr><td>SDTM IG 3.3</td><td>2018年</td><td>Device domains追加</td></tr>
<tr><td>SDTM IG 3.4</td><td>2021年</td><td>最新バージョン</td></tr>
</tbody>
</table>

<h2>SDTMとRawデータの違い</h2>
<table>
<thead><tr><th>特徴</th><th>Rawデータ</th><th>SDTMデータ</th></tr></thead>
<tbody>
<tr><td>形式</td><td>各社独自</td><td>CDISC標準</td></tr>
<tr><td>変数名</td><td>自由</td><td>英語8文字以内</td></tr>
<tr><td>日付形式</td><td>様々</td><td>ISO 8601</td></tr>
<tr><td>コード値</td><td>独自（1=男等）</td><td>CDISC CT（M等）</td></tr>
<tr><td>構造</td><td>CRFページ単位</td><td>ドメイン単位</td></tr>
</tbody>
</table>

<h3>変換の例</h3>
<p><strong>Raw → SDTM</strong></p>
<table>
<thead><tr><th>Raw: 被験者ID</th><th>Raw: 性別</th><th>→</th><th>SDTM: USUBJID</th><th>SDTM: SEX</th></tr></thead>
<tbody>
<tr><td>001</td><td>1（男性）</td><td>→</td><td>ABC-001-001</td><td>M</td></tr>
<tr><td>002</td><td>2（女性）</td><td>→</td><td>ABC-001-002</td><td>F</td></tr>
</tbody>
</table>

<h2>SDTMデータの提出形式</h2>
<p>SDTMデータは<strong>SAS Transport Format（XPT v5）</strong>で提出します。各ドメインが1つのXPTファイルとなります。</p>

<div class="info-box warning">
<div class="info-box-title">⚠️ XPTファイルの制約</div>
・変数名：最大8文字<br>
・データセット名：最大8文字<br>
・変数ラベル：最大40文字<br>
・文字変数の最大長：200バイト（旧仕様）
</div>
`,
            quiz: [
                { id: "q102_1", type: "choice", question: "SDTMの正式名称は？", options: ["Study Data Transfer Model", "Study Data Tabulation Model", "Standard Data Tabulation Method", "Study Database Table Model"], answer: 1, explanation: "SDTMはStudy Data Tabulation Modelの略です。" },
                { id: "q102_2", type: "choice", question: "SDTM IGの最新バージョン（2024年時点）は？", options: ["3.1.2", "3.2", "3.3", "3.4"], answer: 3, explanation: "SDTM IG 3.4が最新バージョンです。" },
                { id: "q102_3", type: "choice", question: "SDTMデータの提出ファイル形式は？", options: ["CSV", "SAS Dataset (.sas7bdat)", "SAS Transport (.xpt)", "Excel (.xlsx)"], answer: 2, explanation: "SDTMはSAS Transport Format（.xpt）で提出します。" },
                { id: "q102_4", type: "choice", question: "SDTMの日付形式は？", options: ["YYYY/MM/DD", "DD-MON-YYYY", "ISO 8601 (YYYY-MM-DD)", "MM/DD/YYYY"], answer: 2, explanation: "SDTMではISO 8601形式を使用します。" },
                { id: "q102_5", type: "fill", question: "SDTMの実装ガイドラインの略称は？（SDTM ___）", answer: "IG", explanation: "SDTM IGがSDTMの実装ガイドラインです。" }
            ]
        },
        {
            id: 103,
            title: "SDTM構造",
            duration: "25分",
            content: `
<h2>Observation Class（観察クラス）</h2>
<p>SDTMのドメインは<strong>Observation Class</strong>によって分類されます。</p>

<table>
<thead><tr><th>クラス</th><th>英語名</th><th>説明</th><th>代表ドメイン</th></tr></thead>
<tbody>
<tr><td><strong>介入</strong></td><td>Interventions</td><td>治療・投薬の記録</td><td>CM, EX, SU</td></tr>
<tr><td><strong>事象</strong></td><td>Events</td><td>被験者に起こった出来事</td><td>AE, DS, MH, CE</td></tr>
<tr><td><strong>所見</strong></td><td>Findings</td><td>検査・測定結果</td><td>LB, VS, EG, PE, QS</td></tr>
<tr><td><strong>特殊目的</strong></td><td>Special Purpose</td><td>特殊なデータ</td><td>DM, SV, SE</td></tr>
<tr><td><strong>試験デザイン</strong></td><td>Trial Design</td><td>試験の設計情報</td><td>TA, TE, TV, TI, TS</td></tr>
<tr><td><strong>関連</strong></td><td>Relationship</td><td>データ間の関連</td><td>RELREC</td></tr>
<tr><td><strong>関連者</strong></td><td>Associated Persons</td><td>関連する人物のデータ</td><td>AP-- domains</td></tr>
</tbody>
</table>

<h2>各Observation Classの一般構造</h2>

<h3>Interventionsクラス</h3>
<table>
<thead><tr><th>変数パターン</th><th>例（CM）</th><th>説明</th></tr></thead>
<tbody>
<tr><td>--TRT</td><td>CMTRT</td><td>治療/薬剤名（Topic）</td></tr>
<tr><td>--DECOD</td><td>CMDECOD</td><td>辞書コード化名称</td></tr>
<tr><td>--DOSE</td><td>CMDOSE</td><td>投与量</td></tr>
<tr><td>--STDTC</td><td>CMSTDTC</td><td>開始日</td></tr>
<tr><td>--ENDTC</td><td>CMENDTC</td><td>終了日</td></tr>
</tbody>
</table>

<h3>Eventsクラス</h3>
<table>
<thead><tr><th>変数パターン</th><th>例（AE）</th><th>説明</th></tr></thead>
<tbody>
<tr><td>--TERM</td><td>AETERM</td><td>報告用語（Topic）</td></tr>
<tr><td>--DECOD</td><td>AEDECOD</td><td>辞書コード化用語</td></tr>
<tr><td>--SEV</td><td>AESEV</td><td>重症度</td></tr>
<tr><td>--STDTC</td><td>AESTDTC</td><td>発現日</td></tr>
<tr><td>--ENDTC</td><td>AEENDTC</td><td>転帰日</td></tr>
</tbody>
</table>

<h3>Findingsクラス</h3>
<table>
<thead><tr><th>変数パターン</th><th>例（VS）</th><th>説明</th></tr></thead>
<tbody>
<tr><td>--TESTCD</td><td>VSTESTCD</td><td>検査項目コード（Topic）</td></tr>
<tr><td>--TEST</td><td>VSTEST</td><td>検査項目名</td></tr>
<tr><td>--ORRES</td><td>VSORRES</td><td>原データの結果</td></tr>
<tr><td>--ORRESU</td><td>VSORRESU</td><td>原データの単位</td></tr>
<tr><td>--STRESC</td><td>VSSTRESC</td><td>標準文字結果</td></tr>
<tr><td>--STRESN</td><td>VSSTRESN</td><td>標準数値結果</td></tr>
<tr><td>--STRESU</td><td>VSSTRESU</td><td>標準単位</td></tr>
</tbody>
</table>

<div class="info-box success">
<div class="info-box-title">✅ 覚えるべきポイント</div>
Observation Classを理解すれば、初見のドメインでも変数構造が予測できます。例えば「FA」はFindingsクラスなので、FATESTCD, FAORRES等の変数を持ちます。
</div>

<h2>ドメインの命名規則</h2>
<ul>
<li>ドメインコード：大文字英字<strong>2文字</strong>（例：DM, AE, VS）</li>
<li>SUPPドメイン：<code>SUPP</code> + ドメインコード（例：SUPPDM, SUPPAE）</li>
</ul>
`,
            quiz: [
                { id: "q103_1", type: "choice", question: "AEはどのObservation Classですか？", options: ["Interventions", "Events", "Findings", "Special Purpose"], answer: 1, explanation: "AEはEventsクラスです。有害事象は「出来事」です。" },
                { id: "q103_2", type: "choice", question: "VSはどのObservation Classですか？", options: ["Interventions", "Events", "Findings", "Special Purpose"], answer: 2, explanation: "VSはFindingsクラスです。バイタルサインは「所見」です。" },
                { id: "q103_3", type: "choice", question: "Findingsクラスの結果変数パターンは？", options: ["--TERM", "--TRT", "--ORRES", "--DECOD"], answer: 2, explanation: "--ORRESはFindingsクラスの結果変数パターンです。" },
                { id: "q103_4", type: "choice", question: "DMのObservation Classは？", options: ["Events", "Findings", "Interventions", "Special Purpose"], answer: 3, explanation: "DMはSpecial Purposeクラスです。" },
                { id: "q103_5", type: "fill", question: "Supplemental Qualifierの接頭辞は？（___DM）", answer: "SUPP", explanation: "SUPPがSupplemental Qualifierの接頭辞です。" },
                { id: "q103_6", type: "choice", question: "CMのObservation Classは？", options: ["Interventions", "Events", "Findings", "Trial Design"], answer: 0, explanation: "CMはInterventionsクラスです。併用薬は「介入」です。" }
            ]
        },
        {
            id: 104,
            title: "変数の種類",
            duration: "25分",
            content: `
<h2>Variable Role（変数ロール）</h2>
<table>
<thead><tr><th>ロール</th><th>英語名</th><th>説明</th><th>例</th></tr></thead>
<tbody>
<tr><td><strong>識別子</strong></td><td>Identifier</td><td>レコードを一意に識別</td><td>STUDYID, DOMAIN, USUBJID, xxSEQ</td></tr>
<tr><td><strong>トピック</strong></td><td>Topic</td><td>観察の焦点</td><td>AETERM, VSTESTCD, CMTRT</td></tr>
<tr><td><strong>修飾子</strong></td><td>Qualifier</td><td>追加情報</td><td>AESEV, VSORRES, CMDOSE</td></tr>
<tr><td><strong>タイミング</strong></td><td>Timing</td><td>時間に関する変数</td><td>AESTDTC, VSDTC, VISITNUM</td></tr>
<tr><td><strong>ルール</strong></td><td>Rule</td><td>計算規則</td><td>（Define.xmlで使用）</td></tr>
</tbody>
</table>

<h3>Qualifierのサブカテゴリ</h3>
<table>
<thead><tr><th>サブカテゴリ</th><th>説明</th><th>例</th></tr></thead>
<tbody>
<tr><td>Grouping Qualifier</td><td>グルーピング用</td><td>xxCAT, xxSCAT, xxBODSYS</td></tr>
<tr><td>Result Qualifier</td><td>結果値</td><td>xxORRES, xxSTRESC, xxSTRESN</td></tr>
<tr><td>Synonym Qualifier</td><td>同義語</td><td>xxDECOD, xxTEST</td></tr>
<tr><td>Record Qualifier</td><td>レコード属性</td><td>xxSEV, xxSER, xxREL</td></tr>
<tr><td>Variable Qualifier</td><td>他変数の修飾</td><td>xxORRESU, xxSTRESU</td></tr>
</tbody>
</table>

<h2>Variable Core</h2>
<table>
<thead><tr><th>Core</th><th>意味</th><th>説明</th></tr></thead>
<tbody>
<tr><td><strong>Req</strong></td><td>Required</td><td>必須。値が必要。</td></tr>
<tr><td><strong>Exp</strong></td><td>Expected</td><td>含めるべき。null値可。</td></tr>
<tr><td><strong>Perm</strong></td><td>Permissible</td><td>データあれば含める。なければ省略可。</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">⚠️ CoreとNullの扱い</div>
<strong>Req</strong>変数のnullはバリデーションエラー。<strong>Exp</strong>はnull許容だが変数は存在すべき。<strong>Perm</strong>は変数ごと省略可。
</div>

<h2>共通の識別子変数</h2>
<table>
<thead><tr><th>変数名</th><th>ラベル</th><th>説明</th></tr></thead>
<tbody>
<tr><td><code>STUDYID</code></td><td>Study Identifier</td><td>試験識別子</td></tr>
<tr><td><code>DOMAIN</code></td><td>Domain Abbreviation</td><td>ドメインの2文字コード</td></tr>
<tr><td><code>USUBJID</code></td><td>Unique Subject Identifier</td><td>全試験で一意な被験者ID</td></tr>
<tr><td><code>xxSEQ</code></td><td>Sequence Number</td><td>ドメイン内の連番</td></tr>
</tbody>
</table>

<h3>USUBJIDの構成</h3>
<p><code>USUBJID = STUDYID + "-" + SITEID + "-" + SUBJID</code></p>
<p>例：<code>ABC-001-101-0001</code></p>

<h2>変数命名規則</h2>
<ul>
<li>最大<strong>8文字</strong></li>
<li>英数字とアンダースコアのみ</li>
<li>先頭は英字</li>
<li>ドメイン固有変数は<strong>接頭辞</strong>で開始（例：AETERM, VSTESTCD）</li>
</ul>

<h2>ISO 8601日付形式</h2>
<table>
<thead><tr><th>形式</th><th>例</th><th>用途</th></tr></thead>
<tbody>
<tr><td>完全な日時</td><td>2024-03-15T10:30:00</td><td>正確な日時</td></tr>
<tr><td>日付のみ</td><td>2024-03-15</td><td>日付のみ</td></tr>
<tr><td>年月のみ</td><td>2024-03</td><td>日が不明（部分日付）</td></tr>
<tr><td>年のみ</td><td>2024</td><td>月日が不明</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">💡 部分日付</div>
SDTMではCRFに記録された通りの精度で保持します。日付のimputation（補完）はADaMで行います。
</div>

<h2>インタラクティブ演習</h2>
<div id="exercise-var-roles"></div>
`,
            quiz: [
                { id: "q104_1", type: "choice", question: "AETERMのVariable Roleは？", options: ["Identifier", "Topic", "Qualifier", "Timing"], answer: 1, explanation: "AETERMはTopicです。観察の焦点変数です。" },
                { id: "q104_2", type: "choice", question: "Core=Expの正しい説明は？", options: ["必ず値が必要", "変数は存在すべきだがnull可", "変数ごと省略可", "Define.xmlでのみ使用"], answer: 1, explanation: "Exp変数は存在すべきですが、値はnullでも許容されます。" },
                { id: "q104_3", type: "fill", question: "全試験で一意な被験者IDの変数名は？", answer: "USUBJID", explanation: "USUBJIDはUnique Subject Identifierです。" },
                { id: "q104_4", type: "choice", question: "SDTM変数名の最大文字数は？", options: ["4文字", "8文字", "16文字", "32文字"], answer: 1, explanation: "XPT形式の制約で最大8文字です。" },
                { id: "q104_5", type: "choice", question: "SDTMの日付形式は？", options: ["DD/MM/YYYY", "YYYYMMDD", "ISO 8601 (YYYY-MM-DD)", "SAS日付値"], answer: 2, explanation: "SDTMではISO 8601形式を使用します。" },
                { id: "q104_6", type: "choice", question: "VSORRESのQualifierサブカテゴリは？", options: ["Grouping", "Result", "Synonym", "Record"], answer: 1, explanation: "--ORRES変数はResult Qualifierです。" }
            ]
        },
        {
            id: 105,
            title: "Controlled Terminology",
            duration: "20分",
            content: `
<h2>Controlled Terminology（CT）とは</h2>
<p><strong>CDISC CT</strong>は、SDTM変数に使用できる<strong>標準的な値のリスト（コードリスト）</strong>です。NCI EVSが管理しています。</p>

<h2>よく使うCT</h2>

<h3>SEX（性別）- Non-extensible</h3>
<table>
<thead><tr><th>値</th><th>意味</th></tr></thead>
<tbody>
<tr><td>M</td><td>Male</td></tr>
<tr><td>F</td><td>Female</td></tr>
<tr><td>U</td><td>Unknown</td></tr>
<tr><td>UNDIFFERENTIATED</td><td>Undifferentiated</td></tr>
</tbody>
</table>

<h3>RACE（人種）- Extensible</h3>
<table>
<thead><tr><th>値</th></tr></thead>
<tbody>
<tr><td>WHITE</td></tr>
<tr><td>BLACK OR AFRICAN AMERICAN</td></tr>
<tr><td>ASIAN</td></tr>
<tr><td>AMERICAN INDIAN OR ALASKA NATIVE</td></tr>
<tr><td>NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDER</td></tr>
<tr><td>OTHER</td></tr>
</tbody>
</table>

<h3>NY（Yes/No）- Non-extensible</h3>
<table>
<thead><tr><th>値</th><th>意味</th></tr></thead>
<tbody>
<tr><td>Y</td><td>Yes</td></tr>
<tr><td>N</td><td>No</td></tr>
</tbody>
</table>

<h3>EPOCH（試験期間）</h3>
<table>
<thead><tr><th>値</th><th>説明</th></tr></thead>
<tbody>
<tr><td>SCREENING</td><td>スクリーニング期間</td></tr>
<tr><td>TREATMENT</td><td>治療期間</td></tr>
<tr><td>FOLLOW-UP</td><td>追跡期間</td></tr>
</tbody>
</table>

<h2>Extensible vs Non-extensible</h2>
<table>
<thead><tr><th>種類</th><th>説明</th><th>例</th></tr></thead>
<tbody>
<tr><td><strong>Non-extensible</strong></td><td>リストの値のみ使用可</td><td>SEX, NY</td></tr>
<tr><td><strong>Extensible</strong></td><td>独自の値を追加可</td><td>RACE, UNIT, ROUTE</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">⚠️ Non-extensible CTに注意</div>
Non-extensible CTに未定義の値を使うとPinnacle 21でエラーになります。
</div>

<h2>CTのバージョン管理</h2>
<ul>
<li>CTは定期的に更新（年に数回）</li>
<li>試験開始時にバージョンを決定</li>
<li>試験途中で変更しないのが原則</li>
<li>使用バージョンはDefine.xmlとSDRGに記載</li>
</ul>

<div class="info-box tip">
<div class="info-box-title">💡 実務のコツ</div>
CTのExcelファイルをダウンロードしておき、マッピング時に参照すると効率的です。特にLBやVSのTESTCD/TESTはCTの標準コードを使う必要があります。
</div>
`,
            quiz: [
                { id: "q105_1", type: "choice", question: "CDISC CTを管理しているのは？", options: ["FDA", "CDISC本部", "NCI EVS", "WHO"], answer: 2, explanation: "NCI EVSがCDISC CTを管理・配布しています。" },
                { id: "q105_2", type: "choice", question: "SEXのCTタイプは？", options: ["Extensible", "Non-extensible"], answer: 1, explanation: "SEXはNon-extensibleです。" },
                { id: "q105_3", type: "fill", question: "SDTMで「男性」を表すSEXの値は？（1文字）", answer: "M", explanation: "男性はMです。" },
                { id: "q105_4", type: "choice", question: "ExtensibleなCTの説明で正しいのは？", options: ["リストの値のみ使用可", "独自の値を追加可", "どんな値でも自由", "CTの値を変更できる"], answer: 1, explanation: "Extensible CTでは独自の値を追加できます。" },
                { id: "q105_5", type: "choice", question: "試験途中のCTバージョン変更について正しいのは？", options: ["常に最新に更新すべき", "途中で変更しないのが原則", "FDAの指示時のみ変更", "年1回更新が必要"], answer: 1, explanation: "一貫性のため途中で変更しないのが原則です。" }
            ]
        }
    ]
};
