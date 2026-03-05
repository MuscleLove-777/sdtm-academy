/* ============================================
   SDTM Academy - Level 2: SDTMドメイン詳解
   ============================================ */

const LEVEL2_DATA = {
    id: 2,
    title: "SDTMドメイン詳解",
    icon: "🗂️",
    description: "主要SDTMドメインの構造と変数を学ぶ",
    modules: [
        {
            id: 201,
            title: "DM（人口統計学的データ）ドメイン",
            duration: "25分",
            content: `
<h2>DM（Demographics）ドメインの概要</h2>
<p>DMドメインは、SDTMにおいて最も基本的かつ重要なドメインです。<strong>被験者ごとに1レコード</strong>（One Record per Subject）の構造を持ち、被験者の人口統計学的情報を格納します。すべての臨床試験で必須のドメインであり、他のドメインとの結合に使用されるキー変数を含みます。</p>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
DMドメインは被験者1人につき必ず1レコードです。同一被験者の複数レコードが存在する場合、データエラーの可能性があります。
</div>

<h3>DMドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>Controlled Terminology</th></tr>
</thead>
<tbody>
<tr><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>-</td></tr>
<tr><td>DOMAIN</td><td>Domain Abbreviation</td><td>Char</td><td>"DM"</td></tr>
<tr><td>USUBJID</td><td>Unique Subject Identifier</td><td>Char</td><td>-</td></tr>
<tr><td>SUBJID</td><td>Subject Identifier for the Study</td><td>Char</td><td>-</td></tr>
<tr><td>RFSTDTC</td><td>Subject Reference Start Date/Time</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>RFENDTC</td><td>Subject Reference End Date/Time</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>RFXSTDTC</td><td>Date/Time of First Study Treatment</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>RFXENDTC</td><td>Date/Time of Last Study Treatment</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>RFICDTC</td><td>Date/Time of Informed Consent</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>RFPENDTC</td><td>Date/Time of End of Participation</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>DTHDTC</td><td>Date/Time of Death</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>DTHFL</td><td>Subject Death Flag</td><td>Char</td><td>Y</td></tr>
<tr><td>SITEID</td><td>Study Site Identifier</td><td>Char</td><td>-</td></tr>
<tr><td>BRTHDTC</td><td>Date/Time of Birth</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>AGE</td><td>Age</td><td>Num</td><td>-</td></tr>
<tr><td>AGEU</td><td>Age Units</td><td>Char</td><td>AGEU CT (YEARS)</td></tr>
<tr><td>SEX</td><td>Sex</td><td>Char</td><td>SEX CT (M, F, U, UNDIFFERENTIATED)</td></tr>
<tr><td>RACE</td><td>Race</td><td>Char</td><td>RACE CT</td></tr>
<tr><td>ETHNIC</td><td>Ethnicity</td><td>Char</td><td>ETHNIC CT (HISPANIC OR LATINO, NOT HISPANIC OR LATINO)</td></tr>
<tr><td>ARMCD</td><td>Planned Arm Code</td><td>Char</td><td>-</td></tr>
<tr><td>ARM</td><td>Description of Planned Arm</td><td>Char</td><td>-</td></tr>
<tr><td>ACTARMCD</td><td>Actual Arm Code</td><td>Char</td><td>-</td></tr>
<tr><td>ACTARM</td><td>Description of Actual Arm</td><td>Char</td><td>-</td></tr>
<tr><td>COUNTRY</td><td>Country</td><td>Char</td><td>ISO 3166-1 Alpha-3</td></tr>
<tr><td>DMDTC</td><td>Date/Time of Collection</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>DMDY</td><td>Study Day of Collection</td><td>Num</td><td>-</td></tr>
</tbody>
</table>

<h3>データ例</h3>
<table>
<thead>
<tr><th>STUDYID</th><th>USUBJID</th><th>SUBJID</th><th>RFSTDTC</th><th>AGE</th><th>SEX</th><th>RACE</th><th>ARMCD</th><th>ARM</th><th>COUNTRY</th></tr>
</thead>
<tbody>
<tr><td>ABC-001</td><td>ABC-001-001</td><td>001</td><td>2024-03-15</td><td>55</td><td>M</td><td>ASIAN</td><td>TRT</td><td>Treatment A</td><td>JPN</td></tr>
<tr><td>ABC-001</td><td>ABC-001-002</td><td>002</td><td>2024-03-18</td><td>42</td><td>F</td><td>ASIAN</td><td>PBO</td><td>Placebo</td><td>JPN</td></tr>
<tr><td>ABC-001</td><td>ABC-001-003</td><td>003</td><td>2024-04-01</td><td>68</td><td>M</td><td>WHITE</td><td>TRT</td><td>Treatment A</td><td>USA</td></tr>
</tbody>
</table>

<h3>Reference Date変数の理解</h3>
<p>DMドメインには複数の参照日付変数があり、それぞれ異なる意味を持ちます。</p>
<table>
<thead>
<tr><th>変数</th><th>意味</th><th>用途</th></tr>
</thead>
<tbody>
<tr><td>RFSTDTC</td><td>被験者の参照開始日（通常は初回投与日）</td><td>Study Dayの計算基準</td></tr>
<tr><td>RFENDTC</td><td>被験者の参照終了日（通常は最終投与日）</td><td>試験期間の定義</td></tr>
<tr><td>RFXSTDTC</td><td>最初の治験薬投与日時</td><td>曝露開始の特定</td></tr>
<tr><td>RFXENDTC</td><td>最後の治験薬投与日時</td><td>曝露終了の特定</td></tr>
<tr><td>RFICDTC</td><td>同意取得日</td><td>同意プロセスの記録</td></tr>
<tr><td>RFPENDTC</td><td>試験参加終了日</td><td>最後の接触日</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">注意</div>
<strong>RFSTDTC</strong>はStudy Dayの計算基準日です。この日付が正しくないと、すべてのドメインの--DY変数に影響します。RFSTDTC自体のStudy Dayは常に1です（Day 0は存在しません）。
</div>

<h3>よくある問題と対策</h3>
<ul>
<li><strong>ARM vs ACTARM</strong>: ARMは計画された投与群、ACTARMは実際の投与群です。プロトコル逸脱で群が変わった場合に異なる値になります。Screen Failureの被験者はARM = "Screen Failure" とします。</li>
<li><strong>RACEの複数回答</strong>: 被験者が複数の人種を選択した場合、RACE = "MULTIPLE" とし、詳細はSUPPDMに格納します。</li>
<li><strong>AGEの計算</strong>: 同意取得日時点の年齢を格納します。BRTHDTCから計算する場合は切り捨てが一般的です。</li>
<li><strong>COUNTRY</strong>: ISO 3166-1 Alpha-3コード（例: JPN, USA, GBR）を使用します。</li>
</ul>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* DM ドメインの基本的な作成例 */
data dm;
    set raw.demographics;
    length STUDYID $20 DOMAIN $2 USUBJID $40 SUBJID $10;

    STUDYID = "ABC-001";
    DOMAIN  = "DM";
    USUBJID = catx("-", STUDYID, put(site, z3.), put(subjnum, z3.));
    SUBJID  = put(subjnum, z3.);

    /* AGE calculation */
    AGE  = intck('YEAR', input(BRTHDTC, e8601da.), input(RFICDTC, e8601da.));
    AGEU = "YEARS";
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q201_1",
                    type: "choice",
                    question: "DMドメインにおいて、1被験者あたりのレコード数はいくつですか？",
                    options: ["0レコード", "1レコード", "Visit数と同じ", "投与回数と同じ"],
                    answer: 1,
                    explanation: "DMドメインはOne Record per Subjectの構造を持ち、被験者1人につき必ず1レコードです。"
                },
                {
                    id: "q201_2",
                    type: "choice",
                    question: "Study Dayの計算基準日として使用される変数はどれですか？",
                    options: ["RFICDTC", "RFSTDTC", "RFXSTDTC", "DMDTC"],
                    answer: 1,
                    explanation: "RFSTDTC（Subject Reference Start Date/Time）がStudy Dayの計算基準日です。通常は初回投与日が設定されます。"
                },
                {
                    id: "q201_3",
                    type: "fill",
                    question: "被験者が複数の人種を選択した場合、RACE変数にはどの値を設定しますか？（英語で回答）",
                    answer: "MULTIPLE",
                    explanation: "複数の人種が該当する場合、RACE = 'MULTIPLE' とし、詳細はSUPPDMに格納します。"
                },
                {
                    id: "q201_4",
                    type: "choice",
                    question: "COUNTRY変数に使用するコード体系はどれですか？",
                    options: ["ISO 3166-1 Alpha-2（JP, US）", "ISO 3166-1 Alpha-3（JPN, USA）", "FIPS国コード", "自由テキスト"],
                    answer: 1,
                    explanation: "COUNTRYにはISO 3166-1 Alpha-3コード（3文字）を使用します。例: JPN, USA, GBR。"
                },
                {
                    id: "q201_5",
                    type: "choice",
                    question: "Screen Failureの被験者のARM変数にはどの値を設定しますか？",
                    options: ["空白（null）", "NOT ASSIGNED", "Screen Failure", "SCRNFAIL"],
                    answer: 2,
                    explanation: "Screen Failureの被験者にはARM = 'Screen Failure' を設定します。ARMCDは'SCRNFAIL'とするのが一般的です。"
                }
            ]
        },
        {
            id: 202,
            title: "AE（有害事象）ドメイン",
            duration: "30分",
            content: `
<h2>AE（Adverse Events）ドメインの概要</h2>
<p>AEドメインは<strong>Events（事象）クラス</strong>に分類され、臨床試験中に発生した有害事象を記録するドメインです。安全性評価の中核を担い、規制当局への報告においても最も重要なデータの1つです。</p>
<p>構造は<strong>1レコード = 1有害事象イベント</strong>であり、同一被験者に複数のAEレコードが存在し得ます。</p>

<h3>AEドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>Controlled Terminology</th></tr>
</thead>
<tbody>
<tr><td>AETERM</td><td>Reported Term for the Adverse Event</td><td>Char</td><td>-</td></tr>
<tr><td>AEDECOD</td><td>Dictionary-Derived Term</td><td>Char</td><td>MedDRA PT</td></tr>
<tr><td>AECAT</td><td>Category for Adverse Event</td><td>Char</td><td>-</td></tr>
<tr><td>AESCAT</td><td>Subcategory for Adverse Event</td><td>Char</td><td>-</td></tr>
<tr><td>AEBODSYS</td><td>Body System or Organ Class</td><td>Char</td><td>MedDRA SOC</td></tr>
<tr><td>AESEV</td><td>Severity/Intensity</td><td>Char</td><td>MILD, MODERATE, SEVERE</td></tr>
<tr><td>AESER</td><td>Serious Event</td><td>Char</td><td>Y, N</td></tr>
<tr><td>AEREL</td><td>Causality</td><td>Char</td><td>RELATED, NOT RELATED, POSSIBLY RELATED</td></tr>
<tr><td>AEACN</td><td>Action Taken with Study Treatment</td><td>Char</td><td>DOSE NOT CHANGED, DOSE REDUCED, DRUG INTERRUPTED, DRUG WITHDRAWN, NOT APPLICABLE</td></tr>
<tr><td>AEOUT</td><td>Outcome of Adverse Event</td><td>Char</td><td>RECOVERED/RESOLVED, RECOVERING/RESOLVING, NOT RECOVERED/NOT RESOLVED, RECOVERED/RESOLVED WITH SEQUELAE, FATAL</td></tr>
<tr><td>AESTDTC</td><td>Start Date/Time of Adverse Event</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>AEENDTC</td><td>End Date/Time of Adverse Event</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>AESTDY</td><td>Study Day of Start of Adverse Event</td><td>Num</td><td>-</td></tr>
<tr><td>AEENDY</td><td>Study Day of End of Adverse Event</td><td>Num</td><td>-</td></tr>
</tbody>
</table>

<h3>MedDRAコーディング階層</h3>
<p>有害事象は<strong>MedDRA</strong>（Medical Dictionary for Regulatory Activities）を使用してコーディングされます。</p>
<table>
<thead>
<tr><th>階層レベル</th><th>略称</th><th>説明</th><th>SDTM変数</th><th>例</th></tr>
</thead>
<tbody>
<tr><td>System Organ Class</td><td>SOC</td><td>最上位分類</td><td>AEBODSYS</td><td>Gastrointestinal disorders</td></tr>
<tr><td>High Level Group Term</td><td>HLGT</td><td>高位グループ用語</td><td>SUPPAE等</td><td>Nausea and vomiting symptoms</td></tr>
<tr><td>High Level Term</td><td>HLT</td><td>高位用語</td><td>SUPPAE等</td><td>Nausea and vomiting symptoms NEC</td></tr>
<tr><td>Preferred Term</td><td>PT</td><td>基本語</td><td>AEDECOD</td><td>Nausea</td></tr>
<tr><td>Lowest Level Term</td><td>LLT</td><td>下層語</td><td>SUPPAE等</td><td>Nausea</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
SDTMのAEドメインに直接含まれるMedDRA変数は<strong>AEDECOD（PT）</strong>と<strong>AEBODSYS（SOC）</strong>の2つです。HLT, HLGT, LLTは必要に応じてSUPPAEまたはADaMで対応します。
</div>

<h3>データ例</h3>
<table>
<thead>
<tr><th>USUBJID</th><th>AETERM</th><th>AEDECOD</th><th>AEBODSYS</th><th>AESEV</th><th>AESER</th><th>AEREL</th><th>AESTDTC</th><th>AEOUT</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-001</td><td>頭が痛い</td><td>Headache</td><td>Nervous system disorders</td><td>MILD</td><td>N</td><td>RELATED</td><td>2024-03-20</td><td>RECOVERED/RESOLVED</td></tr>
<tr><td>ABC-001-001</td><td>吐き気</td><td>Nausea</td><td>Gastrointestinal disorders</td><td>MODERATE</td><td>N</td><td>POSSIBLY RELATED</td><td>2024-04-02</td><td>RECOVERED/RESOLVED</td></tr>
<tr><td>ABC-001-002</td><td>肝機能異常</td><td>Hepatic function abnormal</td><td>Hepatobiliary disorders</td><td>SEVERE</td><td>Y</td><td>RELATED</td><td>2024-04-10</td><td>RECOVERING/RESOLVING</td></tr>
</tbody>
</table>

<h3>重症度（Severity）と重篤性（Seriousness）の違い</h3>
<div class="info-box warning">
<div class="info-box-title">重要な区別</div>
<p><strong>AESEV（Severity / 重症度）</strong>: 事象の強さ（MILD / MODERATE / SEVERE）を表します。</p>
<p><strong>AESER（Seriousness / 重篤性）</strong>: 事象が重篤基準に該当するか（Y/N）を表します。</p>
<p>例えば、ひどい頭痛はSeverity = SEVEREだがSeriousness = N（重篤ではない）ということがあり得ます。逆に、軽度でも入院が必要な場合はSeverity = MILDでもSeriousness = Yとなります。</p>
</div>

<h3>継続中の有害事象の取り扱い</h3>
<p>試験終了時点で回復していない有害事象は以下のように処理します。</p>
<ul>
<li><strong>AEENDTC</strong>: 空白（null）のまま</li>
<li><strong>AEOUT</strong>: "NOT RECOVERED/NOT RESOLVED"</li>
<li><strong>AEENDY</strong>: 空白（null）</li>
</ul>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* AE ドメインの作成 - Severity と Seriousness のマッピング */
data ae;
    set raw.adverse_events;
    length AESEV $10 AESER $1;

    /* Severity のマッピング */
    select (upcase(severity));
        when ("1","MILD")     AESEV = "MILD";
        when ("2","MODERATE") AESEV = "MODERATE";
        when ("3","SEVERE")   AESEV = "SEVERE";
        otherwise put "WARN: Unexpected severity=" severity;
    end;

    /* Seriousness Flag */
    if upcase(serious) in ("YES","Y") then AESER = "Y";
    else AESER = "N";
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q202_1",
                    type: "choice",
                    question: "AEドメインはSDTMのどのクラスに分類されますか？",
                    options: ["Interventions", "Events", "Findings", "Special Purpose"],
                    answer: 1,
                    explanation: "AEドメインはEvents（事象）クラスに分類されます。有害事象という「出来事」を記録するためです。"
                },
                {
                    id: "q202_2",
                    type: "choice",
                    question: "AEDECODに格納されるMedDRAの階層レベルはどれですか？",
                    options: ["SOC（System Organ Class）", "HLT（High Level Term）", "PT（Preferred Term）", "LLT（Lowest Level Term）"],
                    answer: 2,
                    explanation: "AEDECODにはMedDRAのPreferred Term（PT: 基本語）が格納されます。"
                },
                {
                    id: "q202_3",
                    type: "choice",
                    question: "Grade 3の頭痛（入院不要）の場合、AESEVとAESERの正しい組み合わせはどれですか？",
                    options: ["AESEV=SEVERE, AESER=Y", "AESEV=SEVERE, AESER=N", "AESEV=MODERATE, AESER=N", "AESEV=MILD, AESER=Y"],
                    answer: 1,
                    explanation: "Grade 3はSEVEREですが、入院を要しない場合はSeriousではないため、AESEV=SEVERE, AESER=Nとなります。Severity（重症度）とSeriousness（重篤性）は独立した概念です。"
                },
                {
                    id: "q202_4",
                    type: "fill",
                    question: "試験終了時に回復していない有害事象のAEOUT変数に設定する値は何ですか？（英語で回答、スラッシュを含む）",
                    answer: "NOT RECOVERED/NOT RESOLVED",
                    explanation: "継続中（未回復）の有害事象のAEOUTには'NOT RECOVERED/NOT RESOLVED'を設定します。"
                },
                {
                    id: "q202_5",
                    type: "choice",
                    question: "AEBODSYSに格納されるMedDRAの階層レベルはどれですか？",
                    options: ["PT（Preferred Term）", "SOC（System Organ Class）", "HLT（High Level Term）", "HLGT（High Level Group Term）"],
                    answer: 1,
                    explanation: "AEBODSYSにはMedDRAのSystem Organ Class（SOC: 器官別大分類）が格納されます。"
                }
            ]
        },
        {
            id: 203,
            title: "CM（併用薬）ドメイン",
            duration: "25分",
            content: `
<h2>CM（Concomitant Medications）ドメインの概要</h2>
<p>CMドメインは<strong>Interventions（介入）クラス</strong>に分類され、被験者が治験薬以外に使用した薬剤（併用薬・前治療薬）を記録します。構造は<strong>1レコード = 1薬剤の1使用期間</strong>です。</p>

<h3>CMドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>Controlled Terminology</th></tr>
</thead>
<tbody>
<tr><td>CMTRT</td><td>Reported Name of Drug, Med, or Therapy</td><td>Char</td><td>-</td></tr>
<tr><td>CMDECOD</td><td>Standardized Medication Name</td><td>Char</td><td>WHODrug Preferred Name</td></tr>
<tr><td>CMCAT</td><td>Category for Medication</td><td>Char</td><td>-（例: PRE-TREATMENT, CONCOMITANT）</td></tr>
<tr><td>CMDOSE</td><td>Dose per Administration</td><td>Num</td><td>-</td></tr>
<tr><td>CMDOSU</td><td>Dose Units</td><td>Char</td><td>UNIT CT (mg, g, mL等)</td></tr>
<tr><td>CMDOSFRQ</td><td>Dosing Frequency per Interval</td><td>Char</td><td>FREQ CT (QD, BID, TID, PRN等)</td></tr>
<tr><td>CMROUTE</td><td>Route of Administration</td><td>Char</td><td>ROUTE CT (ORAL, INTRAVENOUS等)</td></tr>
<tr><td>CMSTDTC</td><td>Start Date/Time of Medication</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>CMENDTC</td><td>End Date/Time of Medication</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>CMONGO</td><td>Concomitant Medication Ongoing</td><td>Char</td><td>Y</td></tr>
</tbody>
</table>

<h3>WHODrugコーディング</h3>
<p>併用薬は<strong>WHODrug辞書</strong>を使用して標準化されます。WHODrugにはGlobal版とEnhanced版があり、以下の階層でコーディングされます。</p>
<table>
<thead>
<tr><th>レベル</th><th>説明</th><th>例</th></tr>
</thead>
<tbody>
<tr><td>ATC Level 1</td><td>解剖学的分類</td><td>N - Nervous System</td></tr>
<tr><td>ATC Level 2</td><td>治療分類</td><td>N02 - Analgesics</td></tr>
<tr><td>ATC Level 3</td><td>薬理分類</td><td>N02B - Other Analgesics and Antipyretics</td></tr>
<tr><td>ATC Level 4</td><td>化学分類</td><td>N02BE - Anilides</td></tr>
<tr><td>Drug Name</td><td>一般名</td><td>Acetaminophen（CMDECOD）</td></tr>
</tbody>
</table>

<h3>データ例</h3>
<table>
<thead>
<tr><th>USUBJID</th><th>CMTRT</th><th>CMDECOD</th><th>CMCAT</th><th>CMDOSE</th><th>CMDOSU</th><th>CMDOSFRQ</th><th>CMROUTE</th><th>CMSTDTC</th><th>CMENDTC</th><th>CMONGO</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-001</td><td>ロキソニン</td><td>LOXOPROFEN SODIUM</td><td>CONCOMITANT</td><td>60</td><td>mg</td><td>TID</td><td>ORAL</td><td>2024-03-20</td><td>2024-03-25</td><td></td></tr>
<tr><td>ABC-001-001</td><td>アムロジピン</td><td>AMLODIPINE BESILATE</td><td>PRE-TREATMENT</td><td>5</td><td>mg</td><td>QD</td><td>ORAL</td><td>2023-01-10</td><td></td><td>Y</td></tr>
<tr><td>ABC-001-002</td><td>ガスター</td><td>FAMOTIDINE</td><td>CONCOMITANT</td><td>20</td><td>mg</td><td>BID</td><td>ORAL</td><td>2024-04-05</td><td>2024-04-15</td><td></td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
<strong>CMTRT</strong>にはCRFに記載された報告名（日本語の場合もある）を、<strong>CMDECOD</strong>にはWHODrug辞書に基づく標準名（英語）を格納します。
</div>

<h3>よくある問題と対策</h3>
<ul>
<li><strong>不完全な日付</strong>: 患者が開始月だけ覚えている場合、"2024-03" のように部分日付をISO 8601形式で格納します。</li>
<li><strong>CMONGO = Yの場合</strong>: CMENDTCは空白にします。CMONGOはYのみ（Nは使用しない）。</li>
<li><strong>用量不明</strong>: CMDOSEは空白、CMSTATやCMREASNDで理由を記録する場合があります。</li>
<li><strong>前治療薬 vs 併用薬</strong>: CMCATを使用して分類します（例: "PRE-TREATMENT", "CONCOMITANT"）。</li>
</ul>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* CM ドメインの作成例 - 用量頻度の標準化 */
data cm;
    set raw.conmeds;
    length CMDOSFRQ $20;

    /* 頻度の標準化 */
    select (upcase(compress(frequency)));
        when ("1XDAILY","ONCEDAILY","QD") CMDOSFRQ = "QD";
        when ("2XDAILY","TWICEDAILY","BID") CMDOSFRQ = "BID";
        when ("3XDAILY","TID") CMDOSFRQ = "TID";
        when ("ASNEEDED","PRN") CMDOSFRQ = "PRN";
        otherwise CMDOSFRQ = upcase(frequency);
    end;

    /* 継続中フラグ */
    if upcase(ongoing) = "YES" then do;
        CMONGO = "Y";
        call missing(CMENDTC);
    end;
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q203_1",
                    type: "choice",
                    question: "CMドメインはSDTMのどのクラスに分類されますか？",
                    options: ["Events", "Findings", "Interventions", "Special Purpose"],
                    answer: 2,
                    explanation: "CMドメインはInterventions（介入）クラスに分類されます。薬剤の投与は「介入」にあたるためです。"
                },
                {
                    id: "q203_2",
                    type: "choice",
                    question: "CMDECODの標準化に使用される辞書はどれですか？",
                    options: ["MedDRA", "WHODrug", "SNOMED CT", "ICD-10"],
                    answer: 1,
                    explanation: "併用薬のコーディングにはWHODrug辞書を使用します。MedDRAは有害事象や既往歴に使用します。"
                },
                {
                    id: "q203_3",
                    type: "fill",
                    question: "併用薬が試験終了時も継続中の場合、CMONGO変数に設定する値は何ですか？",
                    answer: "Y",
                    explanation: "継続中の薬剤はCMONGO = 'Y' とします。CMONGOフラグは'Y'のみ使用し、'N'は設定しません。"
                },
                {
                    id: "q203_4",
                    type: "choice",
                    question: "患者が「3月から飲んでいる」と回答し、正確な開始日が不明な場合、CMSTDTCにはどのように記録しますか？",
                    options: ["2024-03-01（月初日を仮定）", "2024-03（部分日付）", "空白にする", "UNKと記録する"],
                    answer: 1,
                    explanation: "ISO 8601では部分日付が許容されており、月まで分かる場合は'2024-03'のように記録します。日を仮定してはいけません。"
                },
                {
                    id: "q203_5",
                    type: "choice",
                    question: "CMTRTとCMDECODの関係として正しいものはどれですか？",
                    options: [
                        "どちらもWHODrug辞書の標準名",
                        "CMTRTはCRF報告名、CMDECODは辞書標準名",
                        "CMTRTは英語名、CMDECODは日本語名",
                        "どちらもCRFに記載された名称"
                    ],
                    answer: 1,
                    explanation: "CMTRTにはCRFに記載された報告名（Verbatim）、CMDECODにはWHODrug辞書に基づく標準化された名称が格納されます。"
                }
            ]
        },
        {
            id: 204,
            title: "MH（既往歴）ドメイン",
            duration: "20分",
            content: `
<h2>MH（Medical History）ドメインの概要</h2>
<p>MHドメインは<strong>Events（事象）クラス</strong>に分類され、被験者の既往歴および合併症（現病歴）を記録します。構造は<strong>1レコード = 1既往歴/合併症</strong>です。</p>

<h3>MHドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>Controlled Terminology</th></tr>
</thead>
<tbody>
<tr><td>MHTERM</td><td>Reported Term for the Medical History</td><td>Char</td><td>-</td></tr>
<tr><td>MHDECOD</td><td>Dictionary-Derived Term</td><td>Char</td><td>MedDRA PT</td></tr>
<tr><td>MHCAT</td><td>Category for Medical History</td><td>Char</td><td>-（例: GENERAL, PRIMARY DIAGNOSIS）</td></tr>
<tr><td>MHBODSYS</td><td>Body System or Organ Class</td><td>Char</td><td>MedDRA SOC</td></tr>
<tr><td>MHSTDTC</td><td>Start Date/Time of Medical History Event</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>MHENDTC</td><td>End Date/Time of Medical History Event</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>MHENRF</td><td>End Relative to Reference Period</td><td>Char</td><td>BEFORE, DURING, AFTER</td></tr>
</tbody>
</table>

<h3>既往歴と合併症の区別</h3>
<p>既往歴（Past History）と合併症（Current Condition）は、試験参照期間との関係で区別します。</p>
<table>
<thead>
<tr><th>分類</th><th>MHENRF</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>既往歴</td><td>BEFORE</td><td>参照期間開始前に終了した疾患</td></tr>
<tr><td>合併症</td><td>DURINGまたは空白</td><td>参照期間中も継続している疾患</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
MHENRFは「既往歴の終了が参照期間に対してどの位置にあるか」を示します。合併症（継続中）の場合、MHENDTCは空白となり、MHENRFも空白になるケースがあります。施設ごとの運用ルールを確認してください。
</div>

<h3>データ例</h3>
<table>
<thead>
<tr><th>USUBJID</th><th>MHTERM</th><th>MHDECOD</th><th>MHBODSYS</th><th>MHCAT</th><th>MHSTDTC</th><th>MHENDTC</th><th>MHENRF</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-001</td><td>高血圧</td><td>Hypertension</td><td>Vascular disorders</td><td>GENERAL</td><td>2018</td><td></td><td></td></tr>
<tr><td>ABC-001-001</td><td>虫垂炎</td><td>Appendicitis</td><td>Gastrointestinal disorders</td><td>GENERAL</td><td>2010-06</td><td>2010-07</td><td>BEFORE</td></tr>
<tr><td>ABC-001-002</td><td>2型糖尿病</td><td>Type 2 diabetes mellitus</td><td>Metabolism and nutrition disorders</td><td>GENERAL</td><td>2020-03</td><td></td><td></td></tr>
</tbody>
</table>

<h3>MedDRAコーディング（MHドメインの場合）</h3>
<p>MHドメインでもAEと同様に<strong>MedDRA</strong>を使用してコーディングします。MHTERMには報告された原語（Verbatim Term）を、MHDECODにはMedDRAのPreferred Term（PT）を格納します。</p>

<div class="info-box warning">
<div class="info-box-title">注意</div>
<p>既往歴の日付は不正確なことが多く、部分日付（年のみ、年月のみ）が頻繁に発生します。"2018" や "2020-03" のようにISO 8601の部分日付として記録してください。日付を推測して補完してはいけません。</p>
</div>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* MH ドメインの作成例 */
data mh;
    set raw.medhistory;
    length MHTERM $200 MHDECOD $200 MHENRF $8;

    MHTERM   = raw_term;
    MHDECOD  = meddra_pt;
    MHBODSYS = meddra_soc;

    /* MHENRF の導出 */
    if not missing(MHENDTC) and MHENDTC < RFSTDTC then
        MHENRF = "BEFORE";
    else if not missing(MHENDTC) then
        MHENRF = "DURING";
    /* 終了日が空白（継続中）の場合は MHENRF も空白 */
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q204_1",
                    type: "choice",
                    question: "MHドメインはSDTMのどのクラスに分類されますか？",
                    options: ["Interventions", "Events", "Findings", "Special Purpose"],
                    answer: 1,
                    explanation: "MHドメインはEvents（事象）クラスに分類されます。AEドメインと同じクラスです。"
                },
                {
                    id: "q204_2",
                    type: "choice",
                    question: "既往歴が治験参照期間の開始前に終了した場合、MHENRFに設定する値はどれですか？",
                    options: ["DURING", "BEFORE", "AFTER", "COMPLETED"],
                    answer: 1,
                    explanation: "参照期間開始前に終了した既往歴はMHENRF = 'BEFORE' となります。"
                },
                {
                    id: "q204_3",
                    type: "fill",
                    question: "MHドメインでのコーディングに使用する辞書は何ですか？（英語で回答）",
                    answer: "MedDRA",
                    explanation: "既往歴のコーディングにはMedDRA辞書を使用します。AEドメインと同じ辞書です。"
                },
                {
                    id: "q204_4",
                    type: "choice",
                    question: "被験者が「2018年頃から高血圧で治療中」と報告した場合、MHSTDTCにはどのように記録しますか？",
                    options: ["2018-01-01", "2018", "2018-06-15（中間日を仮定）", "UNK"],
                    answer: 1,
                    explanation: "年のみ判明している場合は'2018'とISO 8601の部分日付で記録します。月日を仮定してはいけません。"
                },
                {
                    id: "q204_5",
                    type: "choice",
                    question: "合併症（試験中も継続している疾患）の場合、MHENDTCの扱いとして正しいのはどれですか？",
                    options: ["試験終了日を入力", "空白（null）にする", "RFENDTCの値を入力", "CONTINUINGと入力"],
                    answer: 1,
                    explanation: "継続中の合併症はMHENDTCを空白にします。終了日が不明・未確定の場合に日付を仮定してはいけません。"
                }
            ]
        },
        {
            id: 205,
            title: "VS（バイタルサイン）ドメイン",
            duration: "25分",
            content: `
<h2>VS（Vital Signs）ドメインの概要</h2>
<p>VSドメインは<strong>Findings（所見）クラス</strong>に分類され、血圧、脈拍、体温などのバイタルサイン測定結果を記録します。構造は<strong>1レコード = 1被験者 x 1検査項目 x 1時点</strong>です。</p>

<h3>VSドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>Controlled Terminology</th></tr>
</thead>
<tbody>
<tr><td>VSTESTCD</td><td>Vital Signs Test Short Name</td><td>Char</td><td>VSTESTCD CT</td></tr>
<tr><td>VSTEST</td><td>Vital Signs Test Name</td><td>Char</td><td>VSTEST CT</td></tr>
<tr><td>VSORRES</td><td>Result or Finding in Original Units</td><td>Char</td><td>-</td></tr>
<tr><td>VSORRESU</td><td>Original Units</td><td>Char</td><td>UNIT CT</td></tr>
<tr><td>VSSTRESC</td><td>Character Result/Finding in Std Format</td><td>Char</td><td>-</td></tr>
<tr><td>VSSTRESN</td><td>Numeric Result/Finding in Standard Units</td><td>Num</td><td>-</td></tr>
<tr><td>VSSTRESU</td><td>Standard Units</td><td>Char</td><td>UNIT CT</td></tr>
<tr><td>VSSTAT</td><td>Completion Status</td><td>Char</td><td>NOT DONE</td></tr>
<tr><td>VSREASND</td><td>Reason Not Done</td><td>Char</td><td>-</td></tr>
<tr><td>VSLOC</td><td>Location of Vital Signs Measurement</td><td>Char</td><td>LOC CT</td></tr>
<tr><td>VSPOS</td><td>Vital Signs Position of Subject</td><td>Char</td><td>POSITION CT (STANDING, SITTING, SUPINE)</td></tr>
<tr><td>VSDTC</td><td>Date/Time of Measurements</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>VSDY</td><td>Study Day of Vital Signs</td><td>Num</td><td>-</td></tr>
<tr><td>VSTPT</td><td>Planned Time Point Name</td><td>Char</td><td>-</td></tr>
<tr><td>VSTPTNUM</td><td>Planned Time Point Number</td><td>Num</td><td>-</td></tr>
<tr><td>VSELTM</td><td>Planned Elapsed Time from Time Point Ref</td><td>Char</td><td>ISO 8601 Duration</td></tr>
</tbody>
</table>

<h3>標準テストコード</h3>
<table>
<thead>
<tr><th>VSTESTCD</th><th>VSTEST</th><th>Standard Unit</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>SYSBP</td><td>Systolic Blood Pressure</td><td>mmHg</td><td>収縮期血圧</td></tr>
<tr><td>DIABP</td><td>Diastolic Blood Pressure</td><td>mmHg</td><td>拡張期血圧</td></tr>
<tr><td>PULSE</td><td>Pulse Rate</td><td>beats/min</td><td>脈拍数</td></tr>
<tr><td>TEMP</td><td>Temperature</td><td>C</td><td>体温</td></tr>
<tr><td>RESP</td><td>Respiratory Rate</td><td>breaths/min</td><td>呼吸数</td></tr>
<tr><td>HEIGHT</td><td>Height</td><td>cm</td><td>身長</td></tr>
<tr><td>WEIGHT</td><td>Weight</td><td>kg</td><td>体重</td></tr>
<tr><td>BMI</td><td>BMI</td><td>kg/m2</td><td>BMI</td></tr>
</tbody>
</table>

<h3>データ例</h3>
<table>
<thead>
<tr><th>USUBJID</th><th>VSTESTCD</th><th>VSTEST</th><th>VSORRES</th><th>VSORRESU</th><th>VSSTRESN</th><th>VSSTRESU</th><th>VSPOS</th><th>VSDTC</th><th>VSTPT</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-001</td><td>SYSBP</td><td>Systolic Blood Pressure</td><td>128</td><td>mmHg</td><td>128</td><td>mmHg</td><td>SITTING</td><td>2024-03-15T09:00</td><td>PREDOSE</td></tr>
<tr><td>ABC-001-001</td><td>DIABP</td><td>Diastolic Blood Pressure</td><td>82</td><td>mmHg</td><td>82</td><td>mmHg</td><td>SITTING</td><td>2024-03-15T09:00</td><td>PREDOSE</td></tr>
<tr><td>ABC-001-001</td><td>TEMP</td><td>Temperature</td><td>98.6</td><td>F</td><td>37.0</td><td>C</td><td></td><td>2024-03-15T09:00</td><td>PREDOSE</td></tr>
<tr><td>ABC-001-001</td><td>PULSE</td><td>Pulse Rate</td><td>72</td><td>beats/min</td><td>72</td><td>beats/min</td><td>SITTING</td><td>2024-03-15T09:00</td><td>PREDOSE</td></tr>
</tbody>
</table>

<h3>単位変換</h3>
<p>原データの単位（VSORRESU）と標準単位（VSSTRESU）が異なる場合、変換が必要です。</p>
<table>
<thead>
<tr><th>項目</th><th>よくある変換</th><th>計算式</th></tr>
</thead>
<tbody>
<tr><td>体温</td><td>F to C</td><td>C = (F - 32) x 5/9</td></tr>
<tr><td>体重</td><td>lbs to kg</td><td>kg = lbs x 0.45359</td></tr>
<tr><td>身長</td><td>in to cm</td><td>cm = in x 2.54</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">注意</div>
<p>単位変換を行った場合、<strong>VSORRES/VSORRESU</strong>には元の値と単位を残し、<strong>VSSTRESN/VSSTRESU</strong>に変換後の値と標準単位を格納してください。元データは決して上書きしません。</p>
</div>

<h3>ベースラインフラグ</h3>
<p>VSドメイン自体にはベースラインフラグ変数はありませんが、ADaM（ADVS）でベースライン値（ABLFL = "Y"）を特定する際の元データとなります。通常、初回投与前の最後の測定値がベースラインとなります。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* VS ドメインの作成例 - 体温の単位変換 */
data vs;
    set raw.vitals;
    length VSSTRESU $20;

    /* 原データの保持 */
    VSORRES  = put(raw_value, best.);
    VSORRESU = raw_unit;

    /* 体温の単位変換 (F to C) */
    if VSTESTCD = "TEMP" and upcase(VSORRESU) = "F" then do;
        VSSTRESN = round((input(VSORRES, best.) - 32) * 5 / 9, 0.1);
        VSSTRESU = "C";
    end;
    else do;
        VSSTRESN = input(VSORRES, ?? best.);
        VSSTRESU = VSORRESU;
    end;

    VSSTRESC = put(VSSTRESN, best.);
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q205_1",
                    type: "choice",
                    question: "VSドメインはSDTMのどのクラスに分類されますか？",
                    options: ["Events", "Interventions", "Findings", "Special Purpose"],
                    answer: 2,
                    explanation: "VSドメインはFindings（所見）クラスに分類されます。測定結果という「所見」を記録するためです。"
                },
                {
                    id: "q205_2",
                    type: "fill",
                    question: "収縮期血圧のVSTESTCDは何ですか？（英語の略語で回答）",
                    answer: "SYSBP",
                    explanation: "収縮期血圧（Systolic Blood Pressure）のテストコードは'SYSBP'です。"
                },
                {
                    id: "q205_3",
                    type: "choice",
                    question: "原データで体温が98.6Fで記録された場合、VSORRESとVSSTRESNの正しい組み合わせはどれですか？",
                    options: [
                        "VSORRES=37.0, VSSTRESN=37.0",
                        "VSORRES=98.6, VSSTRESN=37.0",
                        "VSORRES=98.6, VSSTRESN=98.6",
                        "VSORRES=37.0, VSSTRESN=98.6"
                    ],
                    answer: 1,
                    explanation: "VSORRESには原データの値（98.6）を、VSSTRESNには標準単位（C）に変換した値（37.0）を格納します。元データは上書きしません。"
                },
                {
                    id: "q205_4",
                    type: "choice",
                    question: "血圧測定が実施されなかった場合のVSSTATの値はどれですか？",
                    options: ["MISSING", "NOT DONE", "NOT AVAILABLE", "空白"],
                    answer: 1,
                    explanation: "検査が実施されなかった場合、VSSTAT = 'NOT DONE' を設定します。VSSTRESNやVSORRESは空白になります。"
                },
                {
                    id: "q205_5",
                    type: "choice",
                    question: "VSPOSに格納される値として適切でないものはどれですか？",
                    options: ["STANDING", "SITTING", "SUPINE", "LYING DOWN"],
                    answer: 3,
                    explanation: "VSPOS（体位）のControlled Terminologyでは STANDING, SITTING, SUPINE が標準的な値です。'LYING DOWN' ではなく 'SUPINE' を使用します。"
                }
            ]
        },
        {
            id: 206,
            title: "LB（臨床検査）ドメイン",
            duration: "30分",
            content: `
<h2>LB（Laboratory Test Results）ドメインの概要</h2>
<p>LBドメインは<strong>Findings（所見）クラス</strong>に分類され、血液学的検査、生化学検査、尿検査などの臨床検査結果を記録します。臨床試験において最もレコード数が多くなるドメインの1つであり、構造は<strong>1レコード = 1被験者 x 1検査項目 x 1時点</strong>です。</p>

<h3>LBドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>Controlled Terminology</th></tr>
</thead>
<tbody>
<tr><td>LBTESTCD</td><td>Lab Test or Examination Short Name</td><td>Char</td><td>LBTESTCD CT</td></tr>
<tr><td>LBTEST</td><td>Lab Test or Examination Name</td><td>Char</td><td>LBTEST CT</td></tr>
<tr><td>LBCAT</td><td>Category for Lab Test</td><td>Char</td><td>-（例: HEMATOLOGY, CHEMISTRY, URINALYSIS）</td></tr>
<tr><td>LBORRES</td><td>Result or Finding in Original Units</td><td>Char</td><td>-</td></tr>
<tr><td>LBORRESU</td><td>Original Units</td><td>Char</td><td>UNIT CT</td></tr>
<tr><td>LBSTRESC</td><td>Character Result/Finding in Std Format</td><td>Char</td><td>-</td></tr>
<tr><td>LBSTRESN</td><td>Numeric Result/Finding in Standard Units</td><td>Num</td><td>-</td></tr>
<tr><td>LBSTRESU</td><td>Standard Units</td><td>Char</td><td>UNIT CT</td></tr>
<tr><td>LBSTNRLO</td><td>Reference Range Lower Limit-Std Units</td><td>Num</td><td>-</td></tr>
<tr><td>LBSTNRHI</td><td>Reference Range Upper Limit-Std Units</td><td>Num</td><td>-</td></tr>
<tr><td>LBNRIND</td><td>Reference Range Indicator</td><td>Char</td><td>NORMAL, LOW, HIGH</td></tr>
<tr><td>LBSTAT</td><td>Completion Status</td><td>Char</td><td>NOT DONE</td></tr>
<tr><td>LBREASND</td><td>Reason Not Done</td><td>Char</td><td>-</td></tr>
<tr><td>LBSPEC</td><td>Specimen Type</td><td>Char</td><td>SPECTYPE CT (BLOOD, SERUM, PLASMA, URINE等)</td></tr>
<tr><td>LBMETHOD</td><td>Method of Test or Examination</td><td>Char</td><td>METHOD CT</td></tr>
<tr><td>LBDTC</td><td>Date/Time of Specimen Collection</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>LBDY</td><td>Study Day of Specimen Collection</td><td>Num</td><td>-</td></tr>
</tbody>
</table>

<h3>基準範囲の取り扱い</h3>
<p>臨床検査データで最も重要な概念の1つが<strong>基準範囲（Normal Range）</strong>です。</p>
<table>
<thead>
<tr><th>変数</th><th>説明</th><th>例</th></tr>
</thead>
<tbody>
<tr><td>LBSTNRLO</td><td>基準範囲下限（標準単位）</td><td>4.0（WBC: 10^3/uL）</td></tr>
<tr><td>LBSTNRHI</td><td>基準範囲上限（標準単位）</td><td>10.0（WBC: 10^3/uL）</td></tr>
<tr><td>LBNRIND</td><td>基準範囲インジケータ</td><td>NORMAL / LOW / HIGH</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
基準範囲は検査機関によって異なります。マルチサイト試験では施設（ラボ）ごとに基準範囲が異なるため、中央検査機関を使用する場合と各施設の検査機関を使用する場合で処理が変わります。
</div>

<h3>データ例</h3>
<table>
<thead>
<tr><th>USUBJID</th><th>LBTESTCD</th><th>LBTEST</th><th>LBCAT</th><th>LBORRES</th><th>LBORRESU</th><th>LBSTRESN</th><th>LBSTRESU</th><th>LBSTNRLO</th><th>LBSTNRHI</th><th>LBNRIND</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-001</td><td>WBC</td><td>Leukocytes</td><td>HEMATOLOGY</td><td>7.2</td><td>10^3/uL</td><td>7.2</td><td>10^3/uL</td><td>4.0</td><td>10.0</td><td>NORMAL</td></tr>
<tr><td>ABC-001-001</td><td>ALT</td><td>Alanine Aminotransferase</td><td>CHEMISTRY</td><td>85</td><td>U/L</td><td>85</td><td>U/L</td><td>7</td><td>40</td><td>HIGH</td></tr>
<tr><td>ABC-001-001</td><td>GLUC</td><td>Glucose</td><td>URINALYSIS</td><td>NEGATIVE</td><td></td><td></td><td></td><td></td><td></td><td>NORMAL</td></tr>
</tbody>
</table>

<h3>文字型結果 vs 数値型結果</h3>
<p>臨床検査結果には数値と文字の両方があります。</p>
<ul>
<li><strong>数値結果</strong>（例: ALT = 85 U/L）: LBORRES（文字型）とLBSTRESN（数値型）の両方に格納</li>
<li><strong>文字型結果</strong>（例: 尿糖 = NEGATIVE）: LBORRESとLBSTRESC（文字型）に格納。LBSTRESNは空白</li>
<li><strong>不等号付き結果</strong>（例: &lt;0.5）: LBORRES = "&lt;0.5"、LBSTRESC = "&lt;0.5"、LBSTRESNの扱いはスポンサーの方針による</li>
</ul>

<div class="info-box warning">
<div class="info-box-title">注意</div>
<p>LBORRESは常に<strong>文字型（Char）</strong>です。数値結果であっても文字として格納されます。数値としての結果はLBSTRESNに格納してください。これにより、"&lt;0.5" や "NEGATIVE" などの非数値結果も同一カラムで取り扱えます。</p>
</div>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* LB ドメインの作成例 - 基準範囲インジケータの導出 */
data lb;
    set raw.labdata;
    length LBNRIND $10;

    /* 数値結果の場合のみ判定 */
    if not missing(LBSTRESN) and
       not missing(LBSTNRLO) and
       not missing(LBSTNRHI) then do;
        if LBSTRESN < LBSTNRLO then LBNRIND = "LOW";
        else if LBSTRESN > LBSTNRHI then LBNRIND = "HIGH";
        else LBNRIND = "NORMAL";
    end;

    /* 文字型結果の場合（例: NEGATIVE / POSITIVE） */
    if LBTESTCD in ("GLUC","PROT","KETONES") and
       not missing(LBORRES) then do;
        if upcase(LBORRES) = "NEGATIVE" then LBNRIND = "NORMAL";
        else if upcase(LBORRES) = "POSITIVE" then LBNRIND = "HIGH";
    end;
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q206_1",
                    type: "choice",
                    question: "LBドメインはSDTMのどのクラスに分類されますか？",
                    options: ["Events", "Interventions", "Findings", "Special Purpose"],
                    answer: 2,
                    explanation: "LBドメインはFindings（所見）クラスに分類されます。VSドメインと同じく測定結果を記録します。"
                },
                {
                    id: "q206_2",
                    type: "choice",
                    question: "LBORRES変数のデータ型は何ですか？",
                    options: ["Num（数値型のみ）", "Char（文字型のみ）", "数値結果はNum、文字結果はChar", "結果に応じて自動判定"],
                    answer: 1,
                    explanation: "LBORRESは常に文字型（Char）です。数値結果でも文字として格納します。数値としての結果はLBSTRESNに格納します。"
                },
                {
                    id: "q206_3",
                    type: "choice",
                    question: "検査結果が基準範囲上限を超えている場合、LBNRINDに設定する値はどれですか？",
                    options: ["ABNORMAL", "HIGH", "ABOVE NORMAL", "H"],
                    answer: 1,
                    explanation: "基準範囲上限を超えている場合、LBNRIND = 'HIGH' を設定します。Controlled Terminologyは NORMAL, LOW, HIGH です。"
                },
                {
                    id: "q206_4",
                    type: "fill",
                    question: "基準範囲の上限値を格納するSDTM変数名は何ですか？",
                    answer: "LBSTNRHI",
                    explanation: "LBSTNRHI（Reference Range Upper Limit in Standard Units）に基準範囲上限値を格納します。"
                },
                {
                    id: "q206_5",
                    type: "choice",
                    question: "尿検査で結果が \"NEGATIVE\" の場合、LBSTRESNにはどの値を設定しますか？",
                    options: ["0", "-1", "空白（null）", "NEGATIVE"],
                    answer: 2,
                    explanation: "文字型結果の場合、LBSTRESN（数値型）は空白にします。'NEGATIVE'はLBORRESとLBSTRESCに格納します。"
                }
            ]
        },
        {
            id: 207,
            title: "EX（曝露）ドメイン",
            duration: "20分",
            content: `
<h2>EX（Exposure）ドメインの概要</h2>
<p>EXドメインは<strong>Interventions（介入）クラス</strong>に分類され、治験薬の投与（曝露）情報を記録します。被験者がいつ、どのくらいの量の治験薬を投与されたかを追跡するための重要なドメインです。</p>
<p>構造は<strong>1レコード = 1投与期間（constant dosing interval）</strong>です。用量や頻度が変わるたびに新しいレコードを作成します。</p>

<h3>EXドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>Controlled Terminology</th></tr>
</thead>
<tbody>
<tr><td>EXTRT</td><td>Name of Treatment</td><td>Char</td><td>-</td></tr>
<tr><td>EXDOSE</td><td>Dose per Administration</td><td>Num</td><td>-</td></tr>
<tr><td>EXDOSU</td><td>Dose Units</td><td>Char</td><td>UNIT CT (mg, g, mL等)</td></tr>
<tr><td>EXDOSFRM</td><td>Dose Form</td><td>Char</td><td>FRM CT (TABLET, CAPSULE, INJECTION等)</td></tr>
<tr><td>EXDOSFRQ</td><td>Dosing Frequency per Interval</td><td>Char</td><td>FREQ CT (QD, BID等)</td></tr>
<tr><td>EXROUTE</td><td>Route of Administration</td><td>Char</td><td>ROUTE CT (ORAL, INTRAVENOUS等)</td></tr>
<tr><td>EXSTDTC</td><td>Start Date/Time of Treatment</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>EXENDTC</td><td>End Date/Time of Treatment</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>EXSTDY</td><td>Study Day of Start of Treatment</td><td>Num</td><td>-</td></tr>
<tr><td>EXENDY</td><td>Study Day of End of Treatment</td><td>Num</td><td>-</td></tr>
</tbody>
</table>

<h3>データ例</h3>
<table>
<thead>
<tr><th>USUBJID</th><th>EXTRT</th><th>EXDOSE</th><th>EXDOSU</th><th>EXDOSFRM</th><th>EXDOSFRQ</th><th>EXROUTE</th><th>EXSTDTC</th><th>EXENDTC</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-001</td><td>Drug A</td><td>100</td><td>mg</td><td>TABLET</td><td>QD</td><td>ORAL</td><td>2024-03-15</td><td>2024-04-14</td></tr>
<tr><td>ABC-001-001</td><td>Drug A</td><td>50</td><td>mg</td><td>TABLET</td><td>QD</td><td>ORAL</td><td>2024-04-15</td><td>2024-06-15</td></tr>
<tr><td>ABC-001-002</td><td>Placebo</td><td>0</td><td>mg</td><td>TABLET</td><td>QD</td><td>ORAL</td><td>2024-03-18</td><td>2024-06-18</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
上の例では被験者001の用量がDay 31から100mgから50mgに減量されています。用量変更があった場合は、変更前後で別レコードに分けます。
</div>

<h3>EXドメインの記録パターン</h3>
<p>EXドメインのレコードの粒度はプロトコルや収集方法によって異なります。</p>
<table>
<thead>
<tr><th>パターン</th><th>説明</th><th>使用場面</th></tr>
</thead>
<tbody>
<tr><td>1レコード/投与日</td><td>毎日1レコード</td><td>IV投与、入院試験</td></tr>
<tr><td>1レコード/投与期間</td><td>同一用量の連続投与を1レコードに集約</td><td>経口投与、長期試験</td></tr>
<tr><td>1レコード/Visit</td><td>Visit単位で集約</td><td>外来試験</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">注意</div>
<p>プラセボの場合、EXDOSE = 0 とするのが一般的です。EXTRTには "Placebo" と記載し、プラセボ群であることを明確にします。用量ゼロを空白にしないよう注意してください。</p>
</div>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* EX ドメインの作成例 - 投与期間の集約 */
data ex;
    set raw.dosing;
    by USUBJID EXTRT EXDOSE EXDOSU EXDOSFRQ EXROUTE;
    length EXSTDTC EXENDTC $20;

    retain _first_dt;

    if first.EXROUTE then _first_dt = dose_date;

    if last.EXROUTE then do;
        EXSTDTC = put(_first_dt, e8601da.);
        EXENDTC = put(dose_date, e8601da.);
        output;
    end;

    drop _first_dt;
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q207_1",
                    type: "choice",
                    question: "EXドメインはSDTMのどのクラスに分類されますか？",
                    options: ["Events", "Findings", "Interventions", "Special Purpose"],
                    answer: 2,
                    explanation: "EXドメインはInterventions（介入）クラスに分類されます。治験薬の投与は「介入」にあたります。"
                },
                {
                    id: "q207_2",
                    type: "choice",
                    question: "被験者が100mg QDで30日間投与後、50mg QDに減量された場合、EXのレコード数はいくつですか？",
                    options: ["1レコード", "2レコード", "30レコード", "60レコード"],
                    answer: 1,
                    explanation: "用量変更があった場合、変更前と変更後で2レコードになります。同一用量の連続投与は1レコードに集約できます。"
                },
                {
                    id: "q207_3",
                    type: "fill",
                    question: "プラセボ群のEXDOSE変数に設定する値は何ですか？（数字で回答）",
                    answer: "0",
                    explanation: "プラセボ群の場合、EXDOSE = 0 を設定します。空白ではなく明示的に0を記録します。"
                },
                {
                    id: "q207_4",
                    type: "choice",
                    question: "EXDOSFRMに格納される値として適切なものはどれですか？",
                    options: ["ORAL", "TABLET", "QD", "mg"],
                    answer: 1,
                    explanation: "EXDOSFRMは剤形（Dose Form）です。TABLETやCAPSULE等が入ります。ORALは投与経路（EXROUTE）、QDは投与頻度（EXDOSFRQ）、mgは用量単位（EXDOSU）です。"
                },
                {
                    id: "q207_5",
                    type: "choice",
                    question: "EXドメインにおいて、新しいレコードを作成すべきタイミングはどれですか？",
                    options: [
                        "毎日必ず新しいレコード",
                        "用量、頻度、経路のいずれかが変わったとき",
                        "Visit毎に必ず新しいレコード",
                        "被験者ごとに1レコードのみ"
                    ],
                    answer: 1,
                    explanation: "EXドメインでは用量、頻度、投与経路などの投与条件が変更されたときに新しいレコードを作成します。同一条件が続く間は1レコードに集約できます。"
                }
            ]
        },
        {
            id: 208,
            title: "DS（治験対象の状況）ドメイン",
            duration: "20分",
            content: `
<h2>DS（Disposition）ドメインの概要</h2>
<p>DSドメインは<strong>Events（事象）クラス</strong>に分類され、被験者の治験における主要なマイルストーン（同意取得、スクリーニング、無作為化、完了、中止等）を記録します。</p>
<p>構造は<strong>1レコード = 1ディスポジションイベント</strong>です。被験者1人に対して複数のイベントが記録されます。</p>

<h3>DSドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>Controlled Terminology</th></tr>
</thead>
<tbody>
<tr><td>DSTERM</td><td>Reported Term for the Disposition Event</td><td>Char</td><td>-</td></tr>
<tr><td>DSDECOD</td><td>Standardized Disposition Term</td><td>Char</td><td>NCOMPLT CT / PROTSUB CT</td></tr>
<tr><td>DSCAT</td><td>Category for Disposition Event</td><td>Char</td><td>DISPOSITION EVENT, PROTOCOL MILESTONE</td></tr>
<tr><td>DSSCAT</td><td>Subcategory for Disposition Event</td><td>Char</td><td>-（例: STUDY TREATMENT, STUDY PARTICIPATION）</td></tr>
<tr><td>DSSTDTC</td><td>Start Date/Time of Disposition Event</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>DSSTDY</td><td>Study Day of Start of Disposition Event</td><td>Num</td><td>-</td></tr>
</tbody>
</table>

<h3>標準的なDSDECOD値</h3>
<table>
<thead>
<tr><th>DSDECOD</th><th>説明</th><th>一般的なDSCAT</th></tr>
</thead>
<tbody>
<tr><td>INFORMED CONSENT OBTAINED</td><td>同意取得</td><td>PROTOCOL MILESTONE</td></tr>
<tr><td>RANDOMIZED</td><td>無作為化</td><td>PROTOCOL MILESTONE</td></tr>
<tr><td>COMPLETED</td><td>試験完了</td><td>DISPOSITION EVENT</td></tr>
<tr><td>SCREEN FAILURE</td><td>スクリーニング脱落</td><td>DISPOSITION EVENT</td></tr>
<tr><td>ADVERSE EVENT</td><td>有害事象による中止</td><td>DISPOSITION EVENT</td></tr>
<tr><td>PHYSICIAN DECISION</td><td>治験責任医師の判断</td><td>DISPOSITION EVENT</td></tr>
<tr><td>WITHDRAWAL BY SUBJECT</td><td>被験者の意思による中止</td><td>DISPOSITION EVENT</td></tr>
<tr><td>LOST TO FOLLOW-UP</td><td>追跡不能</td><td>DISPOSITION EVENT</td></tr>
<tr><td>PROTOCOL VIOLATION</td><td>プロトコル逸脱</td><td>DISPOSITION EVENT</td></tr>
<tr><td>DEATH</td><td>死亡</td><td>DISPOSITION EVENT</td></tr>
</tbody>
</table>

<h3>ディスポジションの流れ</h3>
<div class="info-box success">
<div class="info-box-title">被験者のライフサイクル</div>
<p><strong>同意取得</strong> &rarr; <strong>スクリーニング</strong> &rarr; <strong>無作為化</strong> &rarr; <strong>治療期</strong> &rarr; <strong>完了 / 中止</strong></p>
<p>各段階でDSレコードが作成されます。スクリーニングで脱落した場合は「SCREEN FAILURE」、治療期に中止した場合は中止理由（ADVERSE EVENT等）が記録されます。</p>
</div>

<h3>データ例</h3>
<table>
<thead>
<tr><th>USUBJID</th><th>DSTERM</th><th>DSDECOD</th><th>DSCAT</th><th>DSSCAT</th><th>DSSTDTC</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-001</td><td>Informed Consent Obtained</td><td>INFORMED CONSENT OBTAINED</td><td>PROTOCOL MILESTONE</td><td></td><td>2024-03-10</td></tr>
<tr><td>ABC-001-001</td><td>Randomized</td><td>RANDOMIZED</td><td>PROTOCOL MILESTONE</td><td></td><td>2024-03-15</td></tr>
<tr><td>ABC-001-001</td><td>Completed</td><td>COMPLETED</td><td>DISPOSITION EVENT</td><td>STUDY TREATMENT</td><td>2024-06-15</td></tr>
<tr><td>ABC-001-003</td><td>Adverse Event</td><td>ADVERSE EVENT</td><td>DISPOSITION EVENT</td><td>STUDY TREATMENT</td><td>2024-04-20</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">注意</div>
<p>DSSCATを使用して「治療中止」と「試験参加中止」を区別することが重要です。被験者が治験薬を中止しても、追跡調査を続ける場合があります。</p>
<p>例: DSSCAT = "STUDY TREATMENT"（治療中止）と DSSCAT = "STUDY PARTICIPATION"（試験参加中止）</p>
</div>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* DS ドメインの作成例 - 中止理由のマッピング */
data ds;
    set raw.disposition;
    length DSDECOD $40 DSCAT $30 DSSCAT $30;

    DSCAT  = "DISPOSITION EVENT";
    DSSCAT = "STUDY TREATMENT";

    /* 中止理由の標準化 */
    select (upcase(reason));
        when ("AE","ADVERSE EVENT")
            DSDECOD = "ADVERSE EVENT";
        when ("COMPLETED","COMPLETE")
            DSDECOD = "COMPLETED";
        when ("WITHDRAWAL","WITHDREW CONSENT")
            DSDECOD = "WITHDRAWAL BY SUBJECT";
        when ("LOST","LOST TO FOLLOW UP")
            DSDECOD = "LOST TO FOLLOW-UP";
        when ("PD","PHYSICIAN DECISION")
            DSDECOD = "PHYSICIAN DECISION";
        otherwise
            DSDECOD = upcase(reason);
    end;

    DSTERM = DSDECOD;
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q208_1",
                    type: "choice",
                    question: "DSドメインはSDTMのどのクラスに分類されますか？",
                    options: ["Interventions", "Events", "Findings", "Special Purpose"],
                    answer: 1,
                    explanation: "DSドメインはEvents（事象）クラスに分類されます。ディスポジションイベントは「出来事」として記録されます。"
                },
                {
                    id: "q208_2",
                    type: "fill",
                    question: "被験者が試験を正常に完了した場合、DSDECODに設定する標準値は何ですか？（英語で回答）",
                    answer: "COMPLETED",
                    explanation: "試験を正常に完了した場合、DSDECOD = 'COMPLETED' を設定します。"
                },
                {
                    id: "q208_3",
                    type: "choice",
                    question: "スクリーニングで不適格となった被験者のDSDECODはどれですか？",
                    options: ["INELIGIBLE", "SCREEN FAILURE", "NOT ENROLLED", "SCREENING FAILED"],
                    answer: 1,
                    explanation: "スクリーニングで不適格となった場合、DSDECOD = 'SCREEN FAILURE' が標準値です。"
                },
                {
                    id: "q208_4",
                    type: "choice",
                    question: "被験者が治験薬を中止したが追跡調査は継続している場合、DSSCATの使い分けとして正しいものはどれですか？",
                    options: [
                        "治療中止も試験参加中止も同じレコード",
                        "治療中止はDSSCAT='STUDY TREATMENT'、参加中止はDSSCAT='STUDY PARTICIPATION'",
                        "治療中止はDSCATで区別する",
                        "追跡調査はDSドメインに含めない"
                    ],
                    answer: 1,
                    explanation: "DSSCATを使用して'STUDY TREATMENT'（治療中止）と'STUDY PARTICIPATION'（試験参加中止）を区別します。"
                },
                {
                    id: "q208_5",
                    type: "choice",
                    question: "同意取得のDSレコードにおけるDSCATの値として適切なのはどれですか？",
                    options: ["DISPOSITION EVENT", "PROTOCOL MILESTONE", "INFORMED CONSENT", "ENROLLMENT"],
                    answer: 1,
                    explanation: "同意取得や無作為化などの試験の節目はDSCAT = 'PROTOCOL MILESTONE' として記録します。DISPOSITION EVENTは完了や中止のイベントに使用します。"
                }
            ]
        },
        {
            id: 209,
            title: "SV（来院）ドメイン",
            duration: "20分",
            content: `
<h2>SV（Subject Visits）ドメインの概要</h2>
<p>SVドメインは<strong>Special Purpose（特殊目的）クラス</strong>に分類され、被験者の来院情報を記録します。構造は<strong>1レコード = 1被験者 x 1来院</strong>です。各来院の開始日時と終了日時を含み、試験の時間軸を構成します。</p>

<h3>SVドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>Controlled Terminology</th></tr>
</thead>
<tbody>
<tr><td>VISITNUM</td><td>Visit Number</td><td>Num</td><td>-</td></tr>
<tr><td>VISIT</td><td>Visit Name</td><td>Char</td><td>-</td></tr>
<tr><td>VISITDY</td><td>Planned Study Day of Visit</td><td>Num</td><td>-</td></tr>
<tr><td>SVSTDTC</td><td>Start Date/Time of Visit</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>SVENDTC</td><td>End Date/Time of Visit</td><td>Char</td><td>ISO 8601</td></tr>
<tr><td>SVSTDY</td><td>Study Day of Start of Visit</td><td>Num</td><td>-</td></tr>
<tr><td>SVENDY</td><td>Study Day of End of Visit</td><td>Num</td><td>-</td></tr>
<tr><td>SVUPDES</td><td>Description of Unplanned Visit</td><td>Char</td><td>-</td></tr>
</tbody>
</table>

<h3>データ例</h3>
<table>
<thead>
<tr><th>USUBJID</th><th>VISITNUM</th><th>VISIT</th><th>VISITDY</th><th>SVSTDTC</th><th>SVENDTC</th><th>SVSTDY</th><th>SVENDY</th><th>SVUPDES</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-001</td><td>1</td><td>SCREENING</td><td>-14</td><td>2024-03-01</td><td>2024-03-01</td><td>-14</td><td>-14</td><td></td></tr>
<tr><td>ABC-001-001</td><td>2</td><td>BASELINE</td><td>1</td><td>2024-03-15</td><td>2024-03-15</td><td>1</td><td>1</td><td></td></tr>
<tr><td>ABC-001-001</td><td>3</td><td>WEEK 4</td><td>29</td><td>2024-04-12</td><td>2024-04-12</td><td>29</td><td>29</td><td></td></tr>
<tr><td>ABC-001-001</td><td>3.1</td><td>UNSCHEDULED</td><td></td><td>2024-04-20</td><td>2024-04-20</td><td>37</td><td>37</td><td>AE follow-up</td></tr>
<tr><td>ABC-001-001</td><td>4</td><td>WEEK 8</td><td>57</td><td>2024-05-10</td><td>2024-05-10</td><td>57</td><td>57</td><td></td></tr>
</tbody>
</table>

<h3>Visit Window（来院ウィンドウ）</h3>
<p>臨床試験では、被験者が予定日に正確に来院できないことが一般的です。そのため、各Visitには許容範囲（Window）が設定されます。</p>
<table>
<thead>
<tr><th>Visit</th><th>Target Day</th><th>Window</th><th>許容範囲</th></tr>
</thead>
<tbody>
<tr><td>SCREENING</td><td>Day -14</td><td>-28 to -1</td><td>Day -28 ~ Day -1</td></tr>
<tr><td>BASELINE</td><td>Day 1</td><td>0</td><td>Day 1</td></tr>
<tr><td>WEEK 4</td><td>Day 29</td><td>+/- 3</td><td>Day 26 ~ Day 32</td></tr>
<tr><td>WEEK 8</td><td>Day 57</td><td>+/- 5</td><td>Day 52 ~ Day 62</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
SVドメインには実際の来院日（SVSTDTC）を記録します。Visit Windowの判定はADaM（解析データ）の段階で行われます。SDTMでは計画日（VISITDY）と実測日（SVSTDY）の両方を保持します。
</div>

<h3>予定外来院（Unscheduled Visit）の取り扱い</h3>
<p>予定外来院は以下のルールで記録します。</p>
<ul>
<li><strong>VISITNUM</strong>: 前回の予定来院番号の小数値（例: Visit 3の後なら 3.1, 3.2 ...）</li>
<li><strong>VISIT</strong>: "UNSCHEDULED" と記録</li>
<li><strong>VISITDY</strong>: 空白（計画されていないため）</li>
<li><strong>SVUPDES</strong>: 予定外来院の理由を記述</li>
</ul>

<div class="info-box warning">
<div class="info-box-title">注意</div>
<p>VISITNUMは<strong>数値型</strong>です。Visit間の順序を正しく表現するために、予定外来院には小数を使用します。VISITNUMの値は被験者間で一貫している必要があります（同じVisit名には同じVISITNUMを割り当てる）。</p>
</div>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* SV ドメインの作成例 */
data sv;
    set raw.visits;
    length VISIT $40 SVUPDES $200;

    /* 予定来院 */
    if not missing(planned_visit) then do;
        VISIT   = planned_visit;
        VISITDY = planned_day;
    end;
    /* 予定外来院 */
    else do;
        VISIT   = "UNSCHEDULED";
        SVUPDES = unscheduled_reason;
        call missing(VISITDY);
    end;

    /* Study Day の計算 */
    if not missing(visit_date) and not missing(RFSTDTC_num) then do;
        SVSTDY = visit_date - RFSTDTC_num + (visit_date >= RFSTDTC_num);
    end;
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q209_1",
                    type: "choice",
                    question: "SVドメインはSDTMのどのクラスに分類されますか？",
                    options: ["Events", "Findings", "Interventions", "Special Purpose"],
                    answer: 3,
                    explanation: "SVドメインはSpecial Purpose（特殊目的）クラスに分類されます。DMやSEと同じクラスです。"
                },
                {
                    id: "q209_2",
                    type: "choice",
                    question: "予定外来院（Unscheduled Visit）のVISITDYにはどの値を設定しますか？",
                    options: ["0", "実際のStudy Day", "空白（null）", "-1"],
                    answer: 2,
                    explanation: "予定外来院には計画されたStudy Dayがないため、VISITDYは空白にします。実際のStudy DayはSVSTDYに記録されます。"
                },
                {
                    id: "q209_3",
                    type: "fill",
                    question: "予定外来院の理由を記述する変数名は何ですか？",
                    answer: "SVUPDES",
                    explanation: "SVUPDES（Description of Unplanned Visit）に予定外来院の理由や説明を記述します。"
                },
                {
                    id: "q209_4",
                    type: "choice",
                    question: "Visit 3（WEEK 4）の後に予定外来院が発生した場合、そのVISITNUMとして適切なのはどれですか？",
                    options: ["3", "3.1", "4", "99"],
                    answer: 1,
                    explanation: "予定外来院のVISITNUMには前回の予定来院番号の小数値を使用します。Visit 3の後なら3.1が適切です。"
                },
                {
                    id: "q209_5",
                    type: "choice",
                    question: "SVドメインにおけるVISITDYとSVSTDYの違いとして正しいものはどれですか？",
                    options: [
                        "どちらも同じ意味",
                        "VISITDYは計画日、SVSTDYは実際の来院日のStudy Day",
                        "VISITDYは実際の日、SVSTDYは計画日",
                        "VISITDYはVisit番号、SVSTDYはStudy Day"
                    ],
                    answer: 1,
                    explanation: "VISITDYはプロトコルで計画されたStudy Day、SVSTDYは実際に来院した日のStudy Dayです。この2つを比較することで来院のずれを把握できます。"
                }
            ]
        },
        {
            id: 210,
            title: "SUPPxx（補足修飾子）ドメイン",
            duration: "25分",
            content: `
<h2>SUPPxx（Supplemental Qualifiers）ドメインの概要</h2>
<p>SUPPxxドメインは、親ドメイン（xx部分がドメイン名）に含めることができないデータを格納するための<strong>補足的なドメイン</strong>です。例えば、SUPPDMはDMドメインの補足データ、SUPPAEはAEドメインの補足データを含みます。</p>
<p>SDTMの標準変数だけではカバーできない、スポンサー固有の追加データや、標準構造に当てはまらないデータを記録するために使用されます。</p>

<h3>SUPPxxの構造（変数一覧）</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>試験ID</td></tr>
<tr><td>RDOMAIN</td><td>Related Domain Abbreviation</td><td>Char</td><td>親ドメインの略称（例: DM, AE）</td></tr>
<tr><td>USUBJID</td><td>Unique Subject Identifier</td><td>Char</td><td>被験者ID</td></tr>
<tr><td>IDVAR</td><td>Identifying Variable</td><td>Char</td><td>親ドメインのレコードを特定するキー変数名（例: AESEQ）</td></tr>
<tr><td>IDVARVAL</td><td>Identifying Variable Value</td><td>Char</td><td>IDVARの値（例: "1", "2"）</td></tr>
<tr><td>QNAM</td><td>Qualifier Variable Name</td><td>Char</td><td>補足変数の名前（8文字以内、例: AESSION）</td></tr>
<tr><td>QLABEL</td><td>Qualifier Variable Label</td><td>Char</td><td>補足変数のラベル（例: "Session of AE"）</td></tr>
<tr><td>QVAL</td><td>Data Value</td><td>Char</td><td>補足変数の値</td></tr>
<tr><td>QORIG</td><td>Origin</td><td>Char</td><td>データの出所（CRF, ASSIGNED, DERIVED, PROTOCOL等）</td></tr>
<tr><td>QEVAL</td><td>Evaluator</td><td>Char</td><td>評価者（INVESTIGATOR, SPONSOR, INDEPENDENT ASSESSOR等）</td></tr>
</tbody>
</table>

<h3>データ例（SUPPAE）</h3>
<table>
<thead>
<tr><th>RDOMAIN</th><th>USUBJID</th><th>IDVAR</th><th>IDVARVAL</th><th>QNAM</th><th>QLABEL</th><th>QVAL</th><th>QORIG</th><th>QEVAL</th></tr>
</thead>
<tbody>
<tr><td>AE</td><td>ABC-001-001</td><td>AESEQ</td><td>1</td><td>AETRTEM</td><td>Treatment Emergent Flag</td><td>Y</td><td>DERIVED</td><td></td></tr>
<tr><td>AE</td><td>ABC-001-001</td><td>AESEQ</td><td>1</td><td>AELLT</td><td>MedDRA Lowest Level Term</td><td>Headache</td><td>ASSIGNED</td><td></td></tr>
<tr><td>AE</td><td>ABC-001-002</td><td>AESEQ</td><td>1</td><td>AETRTEM</td><td>Treatment Emergent Flag</td><td>Y</td><td>DERIVED</td><td></td></tr>
</tbody>
</table>

<h3>データ例（SUPPDM）</h3>
<table>
<thead>
<tr><th>RDOMAIN</th><th>USUBJID</th><th>IDVAR</th><th>IDVARVAL</th><th>QNAM</th><th>QLABEL</th><th>QVAL</th><th>QORIG</th><th>QEVAL</th></tr>
</thead>
<tbody>
<tr><td>DM</td><td>ABC-001-001</td><td></td><td></td><td>RACE1</td><td>Race 1</td><td>WHITE</td><td>CRF</td><td></td></tr>
<tr><td>DM</td><td>ABC-001-001</td><td></td><td></td><td>RACE2</td><td>Race 2</td><td>ASIAN</td><td>CRF</td><td></td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
DMドメインの場合、被験者1人につき1レコードなので、IDVARとIDVARVALは空白にできます（USUBJIDだけでレコードを特定できるため）。他のドメインでは--SEQ変数を使ってレコードを特定します。
</div>

<h3>SUPPxxを使うべき場合のルール</h3>
<p>以下の基準で、データを親ドメインに入れるかSUPPxxに入れるかを判断します。</p>
<table>
<thead>
<tr><th>条件</th><th>格納先</th><th>例</th></tr>
</thead>
<tbody>
<tr><td>SDTM IGで定義された標準変数</td><td>親ドメイン</td><td>AESEV, AESER, AEREL</td></tr>
<tr><td>Controlled Terminologyに対応する標準変数</td><td>親ドメイン</td><td>AEOUT, AEACN</td></tr>
<tr><td>標準変数に該当しないが、レコードの修飾情報</td><td>SUPPxx</td><td>Treatment Emergent Flag</td></tr>
<tr><td>スポンサー固有の追加収集データ</td><td>SUPPxx</td><td>独自の重症度スケール</td></tr>
<tr><td>別の被験者・別のドメインへの関連情報</td><td>RELREC</td><td>AEとCMの関連</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">よくある間違い</div>
<ul>
<li><strong>標準変数をSUPPに入れる</strong>: SDTM IGで定義されている変数は親ドメインに含めるべきです。SUPPxxに移すのは誤りです。</li>
<li><strong>QNAMが8文字を超える</strong>: QNAMはSAS変数名として使用できる必要があるため、8文字以内の英数字にしてください。</li>
<li><strong>QVALに長いテキスト</strong>: QVALは200文字が上限です（SDTM IG規定）。長いテキストは適切に要約してください。</li>
<li><strong>IDVARの指定ミス</strong>: 親ドメインの正しい--SEQ変数をIDVARに指定してください。指定を間違えるとレコードの対応が取れなくなります。</li>
</ul>
</div>

<h3>SUPPxx作成のベストプラクティス</h3>
<ul>
<li><strong>QNAM</strong>は分かりやすく命名する（例: AETRTEM = AE Treatment Emergent）</li>
<li><strong>QLABEL</strong>は40文字以内で、変数の意味を明確に記述する</li>
<li><strong>QORIG</strong>のよく使う値: CRF（CRFから収集）, DERIVED（プログラムで導出）, ASSIGNED（割り当て）, PROTOCOL（プロトコルから）</li>
<li><strong>QEVAL</strong>は評価者が存在する場合のみ設定（例: INVESTIGATOR）</li>
</ul>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* SUPPAE ドメインの作成例 */
data suppae;
    set ae_extra;
    length RDOMAIN $2 IDVAR $8 IDVARVAL $40
           QNAM $8 QLABEL $40 QVAL $200 QORIG $20 QEVAL $40;

    RDOMAIN = "AE";

    /* Treatment Emergent Flag の格納 */
    IDVAR    = "AESEQ";
    IDVARVAL = put(AESEQ, best.);
    QNAM     = "AETRTEM";
    QLABEL   = "Treatment Emergent Flag";
    QORIG    = "DERIVED";

    if AESTDTC >= RFXSTDTC then QVAL = "Y";
    else QVAL = "N";

    keep STUDYID RDOMAIN USUBJID IDVAR IDVARVAL
         QNAM QLABEL QVAL QORIG QEVAL;
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q210_1",
                    type: "choice",
                    question: "SUPPxxドメインのQNAM変数の文字数制限はいくつですか？",
                    options: ["4文字以内", "8文字以内", "20文字以内", "40文字以内"],
                    answer: 1,
                    explanation: "QNAMはSAS変数名として使用できる必要があるため、8文字以内の英数字にする必要があります。"
                },
                {
                    id: "q210_2",
                    type: "fill",
                    question: "SUPPxxドメインで親ドメインを特定する変数名は何ですか？",
                    answer: "RDOMAIN",
                    explanation: "RDOMAIN（Related Domain Abbreviation）に親ドメインの略称（DM, AE, CM等）を格納します。"
                },
                {
                    id: "q210_3",
                    type: "choice",
                    question: "DMドメインのSUPPxx（SUPPDM）で、IDVARとIDVARVALの扱いとして正しいものはどれですか？",
                    options: [
                        "IDVARに'SUBJID'、IDVARVALに被験者番号",
                        "IDVARとIDVARVALは空白でよい",
                        "IDVARに'DMSEQ'、IDVARVALに連番",
                        "IDVARに'USUBJID'、IDVARVALに被験者ID"
                    ],
                    answer: 1,
                    explanation: "DMドメインは被験者1人につき1レコードなので、USUBJIDだけでレコードを特定できます。そのためIDVARとIDVARVALは空白にできます。"
                },
                {
                    id: "q210_4",
                    type: "choice",
                    question: "プログラムで導出した値をSUPPxxに格納する場合、QORIGに設定する値はどれですか？",
                    options: ["CRF", "DERIVED", "ASSIGNED", "CALCULATED"],
                    answer: 1,
                    explanation: "プログラムで導出した値のQORIGは'DERIVED'です。CRFから直接収集した場合は'CRF'、割り当てた場合は'ASSIGNED'です。"
                },
                {
                    id: "q210_5",
                    type: "choice",
                    question: "SDTM IGで定義されている標準変数（例: AESEV）のデータはどこに格納すべきですか？",
                    options: ["SUPPAEのQVAL", "AEドメインの該当変数", "SUPPAEまたはAEのどちらでもよい", "RELRECドメイン"],
                    answer: 1,
                    explanation: "SDTM IGで定義されている標準変数は親ドメインに含めるべきです。SUPPxxに入れるのは標準変数に該当しない追加データのみです。"
                }
            ]
        },
        {
            id: 211,
            title: "EG（心電図）ドメイン",
            duration: "20分",
            content: `
<h2>EG（Electrocardiogram）ドメインの概要</h2>
<p>EGドメインは<strong>Findings（所見）観察クラス</strong>に分類され、心電図（ECG）検査のデータを格納するドメインです。臨床試験における心臓安全性の評価に不可欠であり、QT/QTc延長の評価など、規制当局が特に注視するデータを含みます。</p>
<p>構造は<strong>1レコード = 1被験者 × 1検査項目 × 1時点</strong>であり、同一被験者・同一Visitでも複数の検査パラメータが記録されるため、多数のレコードが生成されます。</p>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
EGドメインは心電図の個々の測定値（QT間隔、HR、PR間隔など）をパラメータ単位で格納します。12誘導心電図の場合、1回の検査で複数のパラメータレコードが作成されます。
</div>

<h3>EGドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>試験ID</td></tr>
<tr><td>DOMAIN</td><td>Domain Abbreviation</td><td>Char</td><td>"EG"</td></tr>
<tr><td>USUBJID</td><td>Unique Subject Identifier</td><td>Char</td><td>被験者ID</td></tr>
<tr><td>EGSEQ</td><td>Sequence Number</td><td>Num</td><td>レコードの連番</td></tr>
<tr><td>EGTESTCD</td><td>ECG Test Short Name</td><td>Char</td><td>検査項目の短縮名（例: QTMEAN, HRMEAN）</td></tr>
<tr><td>EGTEST</td><td>ECG Test Name</td><td>Char</td><td>検査項目のフルネーム</td></tr>
<tr><td>EGORRES</td><td>Result or Finding in Original Units</td><td>Char</td><td>オリジナル単位での測定結果</td></tr>
<tr><td>EGORRESU</td><td>Original Units</td><td>Char</td><td>オリジナル単位（例: msec, beats/min）</td></tr>
<tr><td>EGSTRESC</td><td>Character Result/Finding in Std Format</td><td>Char</td><td>標準形式の文字型結果</td></tr>
<tr><td>EGSTRESN</td><td>Numeric Result/Finding in Std Units</td><td>Num</td><td>標準単位での数値結果</td></tr>
<tr><td>EGSTRESU</td><td>Standard Units</td><td>Char</td><td>標準単位</td></tr>
<tr><td>EGPOS</td><td>Position of Subject</td><td>Char</td><td>測定時の体位（SUPINE, SITTING等）</td></tr>
<tr><td>EGMETHOD</td><td>Method of ECG Test</td><td>Char</td><td>測定方法（12-LEAD ECG等）</td></tr>
<tr><td>EGLOC</td><td>Location of ECG Test</td><td>Char</td><td>測定部位</td></tr>
<tr><td>EGDTC</td><td>Date/Time of ECG</td><td>Char</td><td>測定日時（ISO 8601形式）</td></tr>
<tr><td>EGDY</td><td>Study Day of ECG</td><td>Num</td><td>Study Day</td></tr>
<tr><td>EGTPT</td><td>Planned Time Point Name</td><td>Char</td><td>計画タイムポイント名（例: "PREDOSE", "1 HOUR POST DOSE"）</td></tr>
<tr><td>EGTPTNUM</td><td>Planned Time Point Number</td><td>Num</td><td>計画タイムポイント番号</td></tr>
<tr><td>EGELTM</td><td>Planned Elapsed Time from Time Point Ref</td><td>Char</td><td>参照時点からの経過時間（ISO 8601 Duration形式）</td></tr>
<tr><td>EGTPTREF</td><td>Time Point Reference</td><td>Char</td><td>タイムポイントの参照（例: "FIRST DOSE"）</td></tr>
<tr><td>EGEVAL</td><td>Evaluator</td><td>Char</td><td>評価者（INVESTIGATOR, CENTRAL等）</td></tr>
</tbody>
</table>

<h3>主なEGTESTCD値</h3>
<table>
<thead>
<tr><th>EGTESTCD</th><th>EGTEST</th><th>単位</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>INTP</td><td>Interpretation</td><td>-</td><td>総合判定（NORMAL, ABNORMAL等）</td></tr>
<tr><td>QTcF</td><td>QTcF Interval</td><td>msec</td><td>Fridericia補正QT間隔</td></tr>
<tr><td>QTcB</td><td>QTcB Interval</td><td>msec</td><td>Bazett補正QT間隔</td></tr>
<tr><td>QTMEAN</td><td>QT Mean Interval</td><td>msec</td><td>QT間隔平均値</td></tr>
<tr><td>HRMEAN</td><td>HR Mean</td><td>beats/min</td><td>心拍数平均値</td></tr>
<tr><td>PRMEAN</td><td>PR Mean Interval</td><td>msec</td><td>PR間隔平均値</td></tr>
<tr><td>QRSMEAN</td><td>QRS Mean Duration</td><td>msec</td><td>QRS群持続時間平均値</td></tr>
<tr><td>RRMEAN</td><td>RR Mean Interval</td><td>msec</td><td>RR間隔平均値</td></tr>
</tbody>
</table>

<h3>データ例</h3>
<table>
<thead>
<tr><th>USUBJID</th><th>EGTESTCD</th><th>EGTEST</th><th>EGORRES</th><th>EGORRESU</th><th>EGPOS</th><th>EGTPT</th><th>EGEVAL</th><th>EGDTC</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-001</td><td>QTMEAN</td><td>QT Mean Interval</td><td>410</td><td>msec</td><td>SUPINE</td><td>PREDOSE</td><td>CENTRAL</td><td>2024-03-15T08:00</td></tr>
<tr><td>ABC-001-001</td><td>QTcF</td><td>QTcF Interval</td><td>420</td><td>msec</td><td>SUPINE</td><td>PREDOSE</td><td>CENTRAL</td><td>2024-03-15T08:00</td></tr>
<tr><td>ABC-001-001</td><td>HRMEAN</td><td>HR Mean</td><td>72</td><td>beats/min</td><td>SUPINE</td><td>PREDOSE</td><td>CENTRAL</td><td>2024-03-15T08:00</td></tr>
<tr><td>ABC-001-001</td><td>INTP</td><td>Interpretation</td><td>NORMAL</td><td></td><td>SUPINE</td><td>PREDOSE</td><td>INVESTIGATOR</td><td>2024-03-15T08:00</td></tr>
</tbody>
</table>

<h3>Central Reading と Local Reading</h3>
<p>ECGデータでは、中央判定（Central Reading）と施設判定（Local Reading）の区別が重要です。</p>
<table>
<thead>
<tr><th>判定方法</th><th>EGEVAL値</th><th>特徴</th></tr>
</thead>
<tbody>
<tr><td>Central Reading</td><td>CENTRAL</td><td>中央判定施設で一括判定。数値データの精度が高く、QT試験で必須</td></tr>
<tr><td>Local Reading</td><td>INVESTIGATOR</td><td>各施設で医師が判定。リアルタイムの臨床判断に使用</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">注意</div>
<strong>EGEVAL</strong>はCentral ReadingとLocal Readingの両方がある場合に重要です。同一時点・同一パラメータでもEGEVALが異なれば別レコードとなります。QT/QTc延長試験では、Central Readingのデータが主解析に使用されることが一般的です。
</div>

<h3>タイミング変数の組み合わせ</h3>
<p>EGドメインではタイミング変数がセットで使用されます。特にThoroughQT試験（TQT試験）では、投与後の複数時点でのECG測定が求められます。</p>
<table>
<thead>
<tr><th>変数</th><th>役割</th><th>例</th></tr>
</thead>
<tbody>
<tr><td>EGTPT</td><td>計画タイムポイント名</td><td>"1 HOUR POST DOSE"</td></tr>
<tr><td>EGTPTNUM</td><td>タイムポイント番号（ソート用）</td><td>2</td></tr>
<tr><td>EGELTM</td><td>参照時点からの経過時間</td><td>"PT1H"（ISO 8601 Duration）</td></tr>
<tr><td>EGTPTREF</td><td>経過時間の参照イベント</td><td>"FIRST DOSE"</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
EGELTM（Elapsed Time）はISO 8601 Duration形式で記述します。例: PT1H = 1時間後、PT30M = 30分後、-PT30M = 30分前。EGTPTREFと組み合わせることで、正確な測定タイミングを表現できます。
</div>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* EG ドメインの基本的な作成例 */
data eg;
    set raw.ecg;
    length STUDYID $20 DOMAIN $2 USUBJID $40
           EGTESTCD $8 EGTEST $40 EGORRES $200
           EGORRESU $40 EGSTRESC $200 EGSTRESU $40;

    STUDYID = "ABC-001";
    DOMAIN  = "EG";

    /* 数値パラメータの場合 */
    EGSTRESN = input(EGORRES, best.);
    EGSTRESC = put(EGSTRESN, best.);
    EGSTRESU = EGORRESU;

    /* Study Day計算 */
    if not missing(EGDTC) then
        EGDY = datdif(input(RFSTDTC, e8601da.),
                       input(substr(EGDTC,1,10), e8601da.)) +
               (input(substr(EGDTC,1,10), e8601da.) >=
                input(RFSTDTC, e8601da.));
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q211_1",
                    type: "choice",
                    question: "EGドメインが属する観察クラスはどれですか？",
                    options: ["Events（事象）", "Interventions（介入）", "Findings（所見）", "Special Purpose（特殊目的）"],
                    answer: 2,
                    explanation: "EGドメインはFindings（所見）観察クラスに分類されます。心電図の測定値や判定結果を記録するドメインです。"
                },
                {
                    id: "q211_2",
                    type: "choice",
                    question: "QTcF間隔を表すEGTESTCDの値はどれですか？",
                    options: ["QTMEAN", "QTcB", "QTcF", "QTINT"],
                    answer: 2,
                    explanation: "QTcF（Fridericia補正QT間隔）はEGTESTCD = 'QTcF'で記録します。Bazett補正の場合は'QTcB'です。"
                },
                {
                    id: "q211_3",
                    type: "fill",
                    question: "中央判定（Central Reading）の場合、EGEVAL変数に設定する値は何ですか？（英語で回答）",
                    answer: "CENTRAL",
                    explanation: "中央判定施設による判定結果の場合、EGEVAL = 'CENTRAL'を設定します。施設判定の場合は'INVESTIGATOR'です。"
                },
                {
                    id: "q211_4",
                    type: "choice",
                    question: "EGELTMに投与後1時間を表す場合、正しいISO 8601 Duration形式はどれですか？",
                    options: ["1H", "PT1H", "+01:00", "P1H"],
                    answer: 1,
                    explanation: "ISO 8601 Duration形式では、時間はPTの後に記述します。1時間 = PT1H、30分 = PT30Mとなります。"
                },
                {
                    id: "q211_5",
                    type: "choice",
                    question: "同一被験者・同一時点・同一パラメータで、Central ReadingとLocal Readingの両方がある場合のデータ構造として正しいものはどれですか？",
                    options: [
                        "1レコードに両方の結果を格納する",
                        "Local Readingのみ格納し、Central ReadingはSUPPEGに格納する",
                        "EGEVALの値が異なる別レコードとして格納する",
                        "Central Readingのみ格納する"
                    ],
                    answer: 2,
                    explanation: "EGEVALの値が異なれば別レコードとなります。同じ時点・パラメータでもCENTRALとINVESTIGATORで別々のレコードを作成します。"
                }
            ]
        },
        {
            id: 212,
            title: "PE（身体検査）ドメイン",
            duration: "15分",
            content: `
<h2>PE（Physical Examination）ドメインの概要</h2>
<p>PEドメインは<strong>Findings（所見）観察クラス</strong>に分類され、身体検査（Physical Examination）の結果を格納するドメインです。臨床試験において、被験者の身体的状態を体系的に記録するために使用されます。</p>
<p>構造は<strong>1レコード = 1被験者 × 1身体部位/器官系 × 1Visit</strong>です。各Visitで検査された各身体部位について1レコードが作成されます。</p>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
PEドメインは身体検査の所見を体系（Body System）ごとに記録します。正常所見と異常所見の両方を格納し、各レコードがどの身体部位の検査結果かをPETESTCDとPEBODSYSで特定します。
</div>

<h3>PEドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>試験ID</td></tr>
<tr><td>DOMAIN</td><td>Domain Abbreviation</td><td>Char</td><td>"PE"</td></tr>
<tr><td>USUBJID</td><td>Unique Subject Identifier</td><td>Char</td><td>被験者ID</td></tr>
<tr><td>PESEQ</td><td>Sequence Number</td><td>Num</td><td>レコードの連番</td></tr>
<tr><td>PETESTCD</td><td>Body System Examined Short Name</td><td>Char</td><td>検査部位の短縮名（例: HEAD, CHEST, ABDOM）</td></tr>
<tr><td>PETEST</td><td>Body System Examined</td><td>Char</td><td>検査部位のフルネーム（例: Head, Chest, Abdomen）</td></tr>
<tr><td>PEORRES</td><td>Result or Finding in Original Units</td><td>Char</td><td>オリジナルの所見テキスト</td></tr>
<tr><td>PESTRESC</td><td>Character Result/Finding in Std Format</td><td>Char</td><td>標準化された所見（NORMAL, ABNORMAL等）</td></tr>
<tr><td>PELOC</td><td>Location Used for the Measurement</td><td>Char</td><td>測定部位の詳細（例: LEFT, RIGHT）</td></tr>
<tr><td>PEBODSYS</td><td>Body System or Organ Class</td><td>Char</td><td>器官分類（MedDRA SOC等に基づく）</td></tr>
<tr><td>PEMETHOD</td><td>Method of PE Test</td><td>Char</td><td>検査方法（PALPATION, AUSCULTATION等）</td></tr>
<tr><td>PEEVAL</td><td>Evaluator</td><td>Char</td><td>評価者（通常はINVESTIGATOR）</td></tr>
<tr><td>PEDTC</td><td>Date/Time of PE</td><td>Char</td><td>検査日時（ISO 8601形式）</td></tr>
</tbody>
</table>

<h3>一般的なPETESTCDの例</h3>
<table>
<thead>
<tr><th>PETESTCD</th><th>PETEST</th><th>対象部位/器官系</th></tr>
</thead>
<tbody>
<tr><td>HEAD</td><td>Head</td><td>頭部</td></tr>
<tr><td>EYES</td><td>Eyes</td><td>眼</td></tr>
<tr><td>EARS</td><td>Ears</td><td>耳</td></tr>
<tr><td>NECK</td><td>Neck</td><td>頸部</td></tr>
<tr><td>CHEST</td><td>Chest</td><td>胸部</td></tr>
<tr><td>HEART</td><td>Heart</td><td>心臓</td></tr>
<tr><td>LUNGS</td><td>Lungs</td><td>肺</td></tr>
<tr><td>ABDOM</td><td>Abdomen</td><td>腹部</td></tr>
<tr><td>EXTREM</td><td>Extremities</td><td>四肢</td></tr>
<tr><td>SKIN</td><td>Skin</td><td>皮膚</td></tr>
<tr><td>NEURO</td><td>Neurological</td><td>神経系</td></tr>
<tr><td>LYMPH</td><td>Lymph Nodes</td><td>リンパ節</td></tr>
</tbody>
</table>

<h3>データ例</h3>
<table>
<thead>
<tr><th>USUBJID</th><th>PETESTCD</th><th>PETEST</th><th>PEORRES</th><th>PESTRESC</th><th>PEBODSYS</th><th>VISITNUM</th><th>PEDTC</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-001</td><td>HEAD</td><td>Head</td><td>NORMAL</td><td>NORMAL</td><td>HEAD</td><td>1</td><td>2024-03-15</td></tr>
<tr><td>ABC-001-001</td><td>CHEST</td><td>Chest</td><td>NORMAL</td><td>NORMAL</td><td>THORAX AND RESPIRATORY</td><td>1</td><td>2024-03-15</td></tr>
<tr><td>ABC-001-001</td><td>ABDOM</td><td>Abdomen</td><td>Tenderness in RLQ</td><td>ABNORMAL</td><td>GASTROINTESTINAL</td><td>1</td><td>2024-03-15</td></tr>
<tr><td>ABC-001-001</td><td>SKIN</td><td>Skin</td><td>NORMAL</td><td>NORMAL</td><td>SKIN AND SUBCUTANEOUS TISSUE</td><td>1</td><td>2024-03-15</td></tr>
</tbody>
</table>

<h3>PEORRESとPESTRESCの使い分け</h3>
<p>身体検査データでは、オリジナルの記録内容と標準化された結果の区別が重要です。</p>
<table>
<thead>
<tr><th>変数</th><th>内容</th><th>例</th></tr>
</thead>
<tbody>
<tr><td>PEORRES</td><td>CRFに記録された原文そのまま</td><td>"Tenderness in RLQ", "No abnormalities", "NORMAL"</td></tr>
<tr><td>PESTRESC</td><td>標準化された結果</td><td>"NORMAL" または "ABNORMAL"</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">注意</div>
<ul>
<li>PESTRESCは通常 <strong>"NORMAL"</strong> または <strong>"ABNORMAL"</strong> のいずれかに標準化します。詳細な所見はPEORRESに格納し、PESTRESCは臨床的意義の有無を示す標準値とするのが一般的です。</li>
<li>身体検査で<strong>"Not Done"</strong>（未実施）の場合は、PESTAT = "NOT DONE" とし、PEORRESは空白にします。PEREASND（理由）の記録も推奨されます。</li>
</ul>
</div>

<h3>よくある問題と対策</h3>
<ul>
<li><strong>Not Examined vs Normal</strong>: 検査していない部位を"NORMAL"とするのは誤りです。未検査の場合はPESTAT = "NOT DONE"とし、結果変数は空白にします。</li>
<li><strong>臨床的有意性</strong>: 異常所見がある場合、臨床的に意味があるか（Clinically Significant）の判断はSUPPPEに格納することがあります（例: QNAM = "PECLSIG", QVAL = "Y"）。</li>
<li><strong>ベースラインとの比較</strong>: ベースラインからの変化（New, Worsened, Unchanged, Improved）を記録する場合、PESTRESC等に格納するか、SUPPPEに格納するかはスポンサーの定義に従います。</li>
</ul>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* PE ドメインの基本的な作成例 */
data pe;
    set raw.physexam;
    length STUDYID $20 DOMAIN $2 USUBJID $40
           PETESTCD $8 PETEST $40 PEORRES $200
           PESTRESC $200 PEBODSYS $200;

    STUDYID = "ABC-001";
    DOMAIN  = "PE";

    /* 正常・異常の標準化 */
    if upcase(strip(finding)) in ("NORMAL" "NO ABNORMALITIES"
                                   "UNREMARKABLE" "NAD")
    then PESTRESC = "NORMAL";
    else if not missing(finding)
    then PESTRESC = "ABNORMAL";

    PEORRES = finding; /* 原文をそのまま保持 */
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q212_1",
                    type: "choice",
                    question: "PEドメインのレコード構造として正しいものはどれですか？",
                    options: [
                        "被験者1人につき1レコード",
                        "1被験者 × 1身体部位 × 1Visitにつき1レコード",
                        "異常所見がある場合のみレコードを作成",
                        "1被験者 × 1Visitにつき1レコード"
                    ],
                    answer: 1,
                    explanation: "PEドメインは1被験者 × 1身体部位/器官系 × 1Visitにつき1レコードの構造です。正常・異常にかかわらず、検査した各部位のレコードを作成します。"
                },
                {
                    id: "q212_2",
                    type: "choice",
                    question: "身体検査で特定の部位を検査しなかった場合、正しいデータの記録方法はどれですか？",
                    options: [
                        "PEORRESに'NORMAL'を設定する",
                        "レコード自体を作成しない",
                        "PESTATに'NOT DONE'を設定し、結果変数は空白にする",
                        "PESTRESCに'NOT EXAMINED'を設定する"
                    ],
                    answer: 2,
                    explanation: "未検査の場合はPESTAT = 'NOT DONE'とし、PEORRES・PESTRESCは空白にします。未検査の部位を'NORMAL'と記録するのは誤りです。"
                },
                {
                    id: "q212_3",
                    type: "fill",
                    question: "PESTRESCで異常所見を標準化する場合に使用する値は何ですか？（英語で回答）",
                    answer: "ABNORMAL",
                    explanation: "PESTRESCは'NORMAL'または'ABNORMAL'に標準化するのが一般的です。詳細な所見テキストはPEORRESに格納します。"
                },
                {
                    id: "q212_4",
                    type: "choice",
                    question: "PEドメインのPEORRESとPESTRESCの関係として正しい説明はどれですか？",
                    options: [
                        "PEORRESとPESTRESCは常に同じ値を格納する",
                        "PEORRESはCRF原文を保持し、PESTRESCはNORMAL/ABNORMALに標準化する",
                        "PEORRESは数値、PESTRESCは文字列を格納する",
                        "PESTRESCにのみ結果を格納し、PEORRESは空白でよい"
                    ],
                    answer: 1,
                    explanation: "PEORRESにはCRFに記録された原文をそのまま格納し、PESTRESCには標準化した値（NORMAL/ABNORMAL）を格納するのが一般的です。"
                }
            ]
        },
        {
            id: 213,
            title: "RELREC（関連レコード）ドメイン",
            duration: "20分",
            content: `
<h2>RELREC（Related Records）ドメインの概要</h2>
<p>RELRECドメインは<strong>Special Purpose（特殊目的）ドメイン</strong>に分類され、異なるドメイン間または同一ドメイン内のレコード間の関連性を記録するためのドメインです。データセット間の論理的なリンクを定義し、臨床データの因果関係や対応関係を明示します。</p>
<p>例えば、「ある有害事象（AE）に対して処方された併用薬（CM）」や「有害事象により減量された治験薬投与（EX）」といったレコード間の関連を表現します。</p>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
RELRECドメインはデータセット間の関連性を「橋渡し」する役割を持ちます。RELRECがなければ、異なるドメインのレコード間の関係は暗黙的なものとなり、解析時に正確な対応が取れない場合があります。
</div>

<h3>RELRECドメインの変数一覧</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>試験ID</td></tr>
<tr><td>RDOMAIN</td><td>Related Domain Abbreviation</td><td>Char</td><td>関連先ドメインの略称（例: AE, CM, EX）</td></tr>
<tr><td>USUBJID</td><td>Unique Subject Identifier</td><td>Char</td><td>被験者ID</td></tr>
<tr><td>IDVAR</td><td>Identifying Variable</td><td>Char</td><td>レコードを特定する変数名（例: AESEQ, CMSEQ）</td></tr>
<tr><td>IDVARVAL</td><td>Identifying Variable Value</td><td>Char</td><td>IDVARの値（例: "1", "3"）</td></tr>
<tr><td>RELTYPE</td><td>Relationship Type</td><td>Char</td><td>関連タイプ（ONE, MANY）</td></tr>
<tr><td>RELID</td><td>Relationship Identifier</td><td>Char</td><td>関連グループの識別子（同じRELIDのレコードが関連）</td></tr>
</tbody>
</table>

<h3>RELTYPEの理解</h3>
<p>RELTYPEは関連の多重度を示し、レコード間の対応関係を明確にします。</p>
<table>
<thead>
<tr><th>パターン</th><th>RELTYPE値</th><th>説明</th><th>例</th></tr>
</thead>
<tbody>
<tr><td>1対1</td><td>ONE - ONE</td><td>両方のレコードが1件ずつ対応</td><td>1つのAEに対して1つのCM</td></tr>
<tr><td>1対多</td><td>ONE - MANY</td><td>一方が1件、他方が複数件</td><td>1つのAEに対して複数のCM</td></tr>
<tr><td>多対多</td><td>MANY - MANY</td><td>両方とも複数件が対応</td><td>複数のAEに対して複数のCM</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
同じRELIDの値を持つRELRECレコード同士が関連しています。RELIDは被験者内でユニークなグループ識別子として機能します。例えば、RELID = "1"のAEレコードとRELID = "1"のCMレコードが対応関係にあることを示します。
</div>

<h3>実践例1: AEとCMの関連（有害事象に対する併用薬）</h3>
<p>被験者ABC-001-001で、AE（頭痛, AESEQ=2）に対してCM（アセトアミノフェン, CMSEQ=3）が投与された場合:</p>
<table>
<thead>
<tr><th>STUDYID</th><th>RDOMAIN</th><th>USUBJID</th><th>IDVAR</th><th>IDVARVAL</th><th>RELTYPE</th><th>RELID</th></tr>
</thead>
<tbody>
<tr><td>ABC-001</td><td>AE</td><td>ABC-001-001</td><td>AESEQ</td><td>2</td><td>ONE</td><td>1</td></tr>
<tr><td>ABC-001</td><td>CM</td><td>ABC-001-001</td><td>CMSEQ</td><td>3</td><td>ONE</td><td>1</td></tr>
</tbody>
</table>
<p>この例では、RELID = "1" で紐づけられた2レコードにより、AEのSEQ=2（頭痛）とCMのSEQ=3（アセトアミノフェン）が1対1で関連していることを示します。</p>

<h3>実践例2: AEとEXの関連（有害事象による減量）</h3>
<p>被験者ABC-001-002で、AE（肝機能異常, AESEQ=1）により治験薬が減量された場合（EXSEQ=4, 5の2レコード）:</p>
<table>
<thead>
<tr><th>STUDYID</th><th>RDOMAIN</th><th>USUBJID</th><th>IDVAR</th><th>IDVARVAL</th><th>RELTYPE</th><th>RELID</th></tr>
</thead>
<tbody>
<tr><td>ABC-001</td><td>AE</td><td>ABC-001-002</td><td>AESEQ</td><td>1</td><td>ONE</td><td>1</td></tr>
<tr><td>ABC-001</td><td>EX</td><td>ABC-001-002</td><td>EXSEQ</td><td>4</td><td>MANY</td><td>1</td></tr>
<tr><td>ABC-001</td><td>EX</td><td>ABC-001-002</td><td>EXSEQ</td><td>5</td><td>MANY</td><td>1</td></tr>
</tbody>
</table>
<p>この例では、1つのAE（RELTYPE = ONE）に対して2つのEXレコード（RELTYPE = MANY）が関連する1対多の関係を示します。</p>

<div class="info-box warning">
<div class="info-box-title">よくある間違い</div>
<ul>
<li><strong>RELIDの重複</strong>: 同一被験者内で、異なる関連グループに同じRELIDを使用しないでください。各関連グループに一意のRELIDを付与します。</li>
<li><strong>RELTYPE不整合</strong>: 1対多の関係で、ONE側とMANY側のRELTYPEを正しく設定してください。片方のみにレコードがある場合は関連の意味がありません。</li>
<li><strong>IDVARVALの型</strong>: IDVARVALは文字型です。数値のSEQ値を格納する場合でも文字列として格納してください（例: "1", "2"）。</li>
<li><strong>被験者レベルの関連</strong>: USUBJIDが空白の場合、試験レベルの関連を表しますが、通常は被験者レベルで関連を定義します。</li>
</ul>
</div>

<h3>RELRECを使うべき場面</h3>
<ul>
<li><strong>AE → CM</strong>: 有害事象に対して処方された併用薬</li>
<li><strong>AE → EX</strong>: 有害事象による治験薬の用量変更・中断</li>
<li><strong>CM → AE</strong>: 併用薬の副作用として報告された有害事象</li>
<li><strong>MH → AE</strong>: 既往歴と関連する有害事象</li>
<li><strong>PR → AE</strong>: 有害事象に対する処置</li>
</ul>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* RELREC ドメインの作成例: AEとCMの関連 */
data relrec;
    length STUDYID $20 RDOMAIN $2 USUBJID $40
           IDVAR $8 IDVARVAL $40 RELTYPE $4 RELID $40;

    /* AE側レコード */
    STUDYID  = "ABC-001";
    RDOMAIN  = "AE";
    USUBJID  = "ABC-001-001";
    IDVAR    = "AESEQ";
    IDVARVAL = "2";
    RELTYPE  = "ONE";
    RELID    = "1";
    output;

    /* CM側レコード */
    RDOMAIN  = "CM";
    IDVAR    = "CMSEQ";
    IDVARVAL = "3";
    RELTYPE  = "ONE";
    RELID    = "1"; /* 同じRELIDで関連を示す */
    output;
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q213_1",
                    type: "choice",
                    question: "RELRECドメインの主な目的はどれですか？",
                    options: [
                        "ドメイン間の変数定義を統一する",
                        "異なるドメインのレコード間の関連性を記録する",
                        "すべてのドメインの参照日付を管理する",
                        "補足的なデータを格納する"
                    ],
                    answer: 1,
                    explanation: "RELRECドメインは異なるドメイン間（または同一ドメイン内）のレコード間の関連性を記録するためのSpecial Purposeドメインです。"
                },
                {
                    id: "q213_2",
                    type: "fill",
                    question: "RELRECで同じ関連グループに属するレコードを識別するために使用する変数名は何ですか？",
                    answer: "RELID",
                    explanation: "RELID（Relationship Identifier）が同じ値を持つレコード同士が関連グループを形成します。"
                },
                {
                    id: "q213_3",
                    type: "choice",
                    question: "1つのAEに対して複数のCMが関連する場合、AE側のRELTYPEとCM側のRELTYPEの正しい組み合わせはどれですか？",
                    options: [
                        "AE側: MANY, CM側: ONE",
                        "AE側: ONE, CM側: ONE",
                        "AE側: ONE, CM側: MANY",
                        "AE側: MANY, CM側: MANY"
                    ],
                    answer: 2,
                    explanation: "1つのAEに対して複数のCMが対応する場合、AE側はRELTYPE = 'ONE'、CM側はRELTYPE = 'MANY'とします。"
                },
                {
                    id: "q213_4",
                    type: "choice",
                    question: "RELRECのIDVARVAL変数のデータ型について正しい説明はどれですか？",
                    options: [
                        "常に数値型（Num）で格納する",
                        "文字型（Char）で格納する（数値のSEQ値も文字列として格納）",
                        "IDVAR変数と同じ型に合わせる",
                        "型の指定はない"
                    ],
                    answer: 1,
                    explanation: "IDVARVALは文字型（Char）の変数です。--SEQ等の数値を格納する場合でも、文字列として格納します（例: '1', '2'）。"
                }
            ]
        }
    ]
};
