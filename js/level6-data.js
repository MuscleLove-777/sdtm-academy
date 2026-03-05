/* ============================================
   SDTM Academy - Level 6: SDTMアドバンスト
   ============================================ */

const LEVEL6_DATA = {
    id: 6,
    title: "SDTMアドバンスト",
    icon: "🔬",
    description: "試験デザイン・アドバンストドメインと応用トピック",
    modules: [
        {
            id: 601,
            title: "SE（被験者要素）ドメイン",
            duration: "20分",
            content: `
<h2>SE（Subject Elements）ドメインの概要</h2>
<p>SEドメインは<strong>Special Purpose</strong>ドメインに分類され、各被験者が実際に経験した<strong>Element（要素）</strong>および<strong>Epoch（時期）</strong>を記録します。Trial Designドメイン（TA、TE）で定義された計画に対して、被験者ごとの実際の経過を記述するドメインです。</p>
<p>構造は<strong>1レコード = 1被験者の1 Element</strong>であり、被験者が通過した要素ごとにレコードが作成されます。</p>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
SEドメインは計画（Trial Design）と実際（Subject Element）の対比を可能にするドメインです。プロトコル逸脱の検出や被験者の試験経過の追跡に不可欠です。
</div>

<h3>SEドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>試験識別子</td></tr>
<tr><td>DOMAIN</td><td>Domain Abbreviation</td><td>Char</td><td>"SE"</td></tr>
<tr><td>USUBJID</td><td>Unique Subject Identifier</td><td>Char</td><td>被験者固有識別子</td></tr>
<tr><td>SESEQ</td><td>Sequence Number</td><td>Num</td><td>レコードの順序番号</td></tr>
<tr><td>ETCD</td><td>Element Code</td><td>Char</td><td>TEドメインで定義された要素コード</td></tr>
<tr><td>ELEMENT</td><td>Description of Element</td><td>Char</td><td>要素の説明</td></tr>
<tr><td>SESTDTC</td><td>Start Date/Time of Element</td><td>Char</td><td>要素の開始日時（ISO 8601）</td></tr>
<tr><td>SEENDTC</td><td>End Date/Time of Element</td><td>Char</td><td>要素の終了日時（ISO 8601）</td></tr>
<tr><td>TAETORD</td><td>Planned Order of Element within Arm</td><td>Num</td><td>Arm内での要素の計画順序</td></tr>
<tr><td>EPOCH</td><td>Epoch</td><td>Char</td><td>要素が属するEpoch（例: SCREENING, TREATMENT）</td></tr>
</tbody>
</table>

<h3>Trial Designドメインとの関係</h3>
<p>SEドメインは以下のTrial Designドメインと密接に関連します。</p>
<table>
<thead>
<tr><th>ドメイン</th><th>役割</th><th>SEとの関係</th></tr>
</thead>
<tbody>
<tr><td>TA（Trial Arms）</td><td>各Armの計画されたElementの順序を定義</td><td>SEのETCDとEPOCHの計画値を提供</td></tr>
<tr><td>TE（Trial Elements）</td><td>各Elementの定義と遷移ルールを格納</td><td>SEのETCDとELEMENTの参照元</td></tr>
</tbody>
</table>

<h3>典型的な試験経過の例</h3>
<p>以下は、被験者が計画通りに試験を完了した場合のSEデータ例です。</p>
<table>
<thead>
<tr><th>USUBJID</th><th>SESEQ</th><th>ETCD</th><th>ELEMENT</th><th>SESTDTC</th><th>SEENDTC</th><th>TAETORD</th><th>EPOCH</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-001</td><td>1</td><td>SCRN</td><td>Screening</td><td>2024-01-10</td><td>2024-01-23</td><td>1</td><td>SCREENING</td></tr>
<tr><td>ABC-001-001</td><td>2</td><td>RUNIN</td><td>Run-in</td><td>2024-01-24</td><td>2024-02-06</td><td>2</td><td>RUN-IN</td></tr>
<tr><td>ABC-001-001</td><td>3</td><td>TRT01</td><td>Treatment Period 1</td><td>2024-02-07</td><td>2024-05-06</td><td>3</td><td>TREATMENT</td></tr>
<tr><td>ABC-001-001</td><td>4</td><td>FU</td><td>Follow-up</td><td>2024-05-07</td><td>2024-06-04</td><td>4</td><td>FOLLOW-UP</td></tr>
</tbody>
</table>

<h3>プロトコル逸脱の検出</h3>
<p>SEドメインを使用して、計画（TA/TE）と実際の経過の差異を検出できます。</p>
<div class="info-box warning">
<div class="info-box-title">注意</div>
<p>SEドメインの記録がTAドメインの計画と異なる場合、プロトコル逸脱の可能性を示します。例えば以下のケースがあります。</p>
<ul>
<li>計画にないElementが存在する（予定外の要素）</li>
<li>Elementの順序がTAの定義と異なる（順序逸脱）</li>
<li>特定のElementが欠落している（要素スキップ）</li>
<li>Element間に時間的ギャップがある</li>
</ul>
</div>

<h3>プロトコル逸脱の例</h3>
<p>以下は、被験者がRun-in期間をスキップした場合の例です。</p>
<table>
<thead>
<tr><th>USUBJID</th><th>SESEQ</th><th>ETCD</th><th>ELEMENT</th><th>SESTDTC</th><th>SEENDTC</th><th>EPOCH</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-005</td><td>1</td><td>SCRN</td><td>Screening</td><td>2024-02-01</td><td>2024-02-14</td><td>SCREENING</td></tr>
<tr><td>ABC-001-005</td><td>2</td><td>TRT01</td><td>Treatment Period 1</td><td>2024-02-15</td><td>2024-05-14</td><td>TREATMENT</td></tr>
<tr><td>ABC-001-005</td><td>3</td><td>FU</td><td>Follow-up</td><td>2024-05-15</td><td>2024-06-12</td><td>FOLLOW-UP</td></tr>
</tbody>
</table>
<p>上記の例ではRun-in要素が欠落しており、計画からの逸脱が発生していることがわかります。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* SE ドメインの基本的な作成例 */
data se;
    set raw.subject_elements;
    length STUDYID $20 DOMAIN $2 USUBJID $40
           ETCD $8 ELEMENT $40 EPOCH $20;

    STUDYID = "ABC-001";
    DOMAIN  = "SE";

    /* Element Codeの設定 */
    select (upcase(phase));
        when ("SCREENING") do;
            ETCD = "SCRN"; ELEMENT = "Screening"; EPOCH = "SCREENING";
        end;
        when ("RUN-IN") do;
            ETCD = "RUNIN"; ELEMENT = "Run-in"; EPOCH = "RUN-IN";
        end;
        when ("TREATMENT") do;
            ETCD = "TRT01"; ELEMENT = "Treatment Period 1"; EPOCH = "TREATMENT";
        end;
        when ("FOLLOW-UP") do;
            ETCD = "FU"; ELEMENT = "Follow-up"; EPOCH = "FOLLOW-UP";
        end;
    end;
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q601_1",
                    type: "choice",
                    question: "SEドメインはどのクラスに分類されますか？",
                    options: ["Events", "Findings", "Interventions", "Special Purpose"],
                    answer: 3,
                    explanation: "SEドメインはSpecial Purposeドメインに分類されます。被験者が実際に経験したElementとEpochを記録する特別な目的のドメインです。"
                },
                {
                    id: "q601_2",
                    type: "choice",
                    question: "SEドメインの1レコードは何を表しますか？",
                    options: [
                        "1被験者の全試験期間",
                        "1被験者の1 Element（要素）",
                        "1試験の1 Epoch",
                        "1 Visit"
                    ],
                    answer: 1,
                    explanation: "SEドメインは1レコード = 1被験者の1 Elementの構造です。被験者が通過した各要素（Screening, Treatment等）ごとにレコードが作成されます。"
                },
                {
                    id: "q601_3",
                    type: "choice",
                    question: "SEドメインのETCD変数の値はどのドメインで定義されますか？",
                    options: ["TA（Trial Arms）", "TE（Trial Elements）", "TV（Trial Visits）", "DM（Demographics）"],
                    answer: 1,
                    explanation: "ETCD（Element Code）はTE（Trial Elements）ドメインで定義されます。TEドメインが各Elementの定義と遷移ルールを提供します。"
                },
                {
                    id: "q601_4",
                    type: "fill",
                    question: "SEドメインで要素の開始日時を格納する変数名は何ですか？",
                    answer: "SESTDTC",
                    explanation: "SESTDTC（Start Date/Time of Element）にElementの開始日時をISO 8601形式で格納します。"
                }
            ]
        },
        {
            id: 602,
            title: "TA/TE（試験デザイン）ドメイン",
            duration: "25分",
            content: `
<h2>Trial Designモデルの概要</h2>
<p>SDTMのTrial Designモデルは、臨床試験の計画構造をデータとして記述するための枠組みです。以下の5つのドメインで構成されます。</p>
<table>
<thead>
<tr><th>ドメイン</th><th>正式名称</th><th>役割</th></tr>
</thead>
<tbody>
<tr><td>TA</td><td>Trial Arms</td><td>各Armの計画されたElementの順序を定義</td></tr>
<tr><td>TE</td><td>Trial Elements</td><td>各Elementの定義と遷移ルール</td></tr>
<tr><td>TV</td><td>Trial Visits</td><td>計画された来院の定義</td></tr>
<tr><td>TI</td><td>Trial Inclusion/Exclusion Criteria</td><td>選択・除外基準の定義</td></tr>
<tr><td>TS</td><td>Trial Summary</td><td>試験の概要パラメータ</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
Trial Designドメインは被験者レベルのデータではなく、<strong>試験レベルのメタデータ</strong>です。試験の計画構造を標準化して記述することで、試験間の比較やメタアナリシスを容易にします。
</div>

<h2>TA（Trial Arms）ドメイン</h2>
<p>TAドメインは、各投与群（Arm）における計画されたElement（要素）の順序を定義します。構造は<strong>1レコード = 1 Armの1計画Element</strong>です。</p>

<h3>TAドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>試験識別子</td></tr>
<tr><td>DOMAIN</td><td>Domain Abbreviation</td><td>Char</td><td>"TA"</td></tr>
<tr><td>ARMCD</td><td>Planned Arm Code</td><td>Char</td><td>投与群コード</td></tr>
<tr><td>ARM</td><td>Description of Planned Arm</td><td>Char</td><td>投与群の説明</td></tr>
<tr><td>TAETORD</td><td>Planned Order of Element within Arm</td><td>Num</td><td>Arm内のElement順序番号</td></tr>
<tr><td>ETCD</td><td>Element Code</td><td>Char</td><td>TEで定義されたElementコード</td></tr>
<tr><td>ELEMENT</td><td>Description of Element</td><td>Char</td><td>要素の説明</td></tr>
<tr><td>TABESSION</td><td>Planned Order of Element within Arm</td><td>Num</td><td>Arm内のセッション番号</td></tr>
<tr><td>EPOCH</td><td>Epoch</td><td>Char</td><td>要素が属するEpoch</td></tr>
</tbody>
</table>

<h3>TA データ例（3群並行デザイン）</h3>
<p>以下は、Placebo群、低用量群、高用量群の3群並行デザインの例です。</p>
<table>
<thead>
<tr><th>ARMCD</th><th>ARM</th><th>TAETORD</th><th>ETCD</th><th>ELEMENT</th><th>EPOCH</th></tr>
</thead>
<tbody>
<tr><td>PBO</td><td>Placebo</td><td>1</td><td>SCRN</td><td>Screening</td><td>SCREENING</td></tr>
<tr><td>PBO</td><td>Placebo</td><td>2</td><td>PBO</td><td>Placebo Treatment</td><td>TREATMENT</td></tr>
<tr><td>PBO</td><td>Placebo</td><td>3</td><td>FU</td><td>Follow-up</td><td>FOLLOW-UP</td></tr>
<tr><td>LOW</td><td>Low Dose (50mg)</td><td>1</td><td>SCRN</td><td>Screening</td><td>SCREENING</td></tr>
<tr><td>LOW</td><td>Low Dose (50mg)</td><td>2</td><td>LOW50</td><td>Low Dose 50mg Treatment</td><td>TREATMENT</td></tr>
<tr><td>LOW</td><td>Low Dose (50mg)</td><td>3</td><td>FU</td><td>Follow-up</td><td>FOLLOW-UP</td></tr>
<tr><td>HIGH</td><td>High Dose (100mg)</td><td>1</td><td>SCRN</td><td>Screening</td><td>SCREENING</td></tr>
<tr><td>HIGH</td><td>High Dose (100mg)</td><td>2</td><td>HI100</td><td>High Dose 100mg Treatment</td><td>TREATMENT</td></tr>
<tr><td>HIGH</td><td>High Dose (100mg)</td><td>3</td><td>FU</td><td>Follow-up</td><td>FOLLOW-UP</td></tr>
</tbody>
</table>

<h2>TE（Trial Elements）ドメイン</h2>
<p>TEドメインは、試験で使用される各Elementの定義と遷移ルールを格納します。構造は<strong>1レコード = 1計画Element</strong>です。</p>

<h3>TEドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>試験識別子</td></tr>
<tr><td>DOMAIN</td><td>Domain Abbreviation</td><td>Char</td><td>"TE"</td></tr>
<tr><td>ETCD</td><td>Element Code</td><td>Char</td><td>要素コード</td></tr>
<tr><td>ELEMENT</td><td>Description of Element</td><td>Char</td><td>要素の説明</td></tr>
<tr><td>TESTRL</td><td>Rule for Start of Element</td><td>Char</td><td>要素開始の遷移ルール</td></tr>
<tr><td>TEENRL</td><td>Rule for End of Element</td><td>Char</td><td>要素終了の遷移ルール</td></tr>
<tr><td>TEDUR</td><td>Planned Duration of Element</td><td>Char</td><td>計画された要素の期間（ISO 8601 Duration）</td></tr>
</tbody>
</table>

<h3>TE データ例</h3>
<table>
<thead>
<tr><th>ETCD</th><th>ELEMENT</th><th>TESTRL</th><th>TEENRL</th><th>TEDUR</th></tr>
</thead>
<tbody>
<tr><td>SCRN</td><td>Screening</td><td>Informed consent signed</td><td>Screening evaluations completed and subject eligible</td><td>P28D</td></tr>
<tr><td>PBO</td><td>Placebo Treatment</td><td>Randomization</td><td>12 weeks of treatment completed or early discontinuation</td><td>P84D</td></tr>
<tr><td>LOW50</td><td>Low Dose 50mg Treatment</td><td>Randomization</td><td>12 weeks of treatment completed or early discontinuation</td><td>P84D</td></tr>
<tr><td>HI100</td><td>High Dose 100mg Treatment</td><td>Randomization</td><td>12 weeks of treatment completed or early discontinuation</td><td>P84D</td></tr>
<tr><td>FU</td><td>Follow-up</td><td>End of treatment</td><td>Follow-up visit completed</td><td>P28D</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
<p>TEDURはISO 8601のDuration形式で記述します。例: P28D（28日間）、P12W（12週間）、P6M（6ヶ月間）。</p>
<p>TESTRL/TEENRLは遷移ルールをテキストで記述します。プログラムで解釈するためのものではなく、人間が読んで理解するための記述です。</p>
</div>

<h2>TV（Trial Visits）ドメイン</h2>
<p>TVドメインは、試験で計画された来院スケジュールを定義します。構造は<strong>1レコード = 1計画Visit</strong>です。</p>

<h3>TVドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>試験識別子</td></tr>
<tr><td>DOMAIN</td><td>Domain Abbreviation</td><td>Char</td><td>"TV"</td></tr>
<tr><td>VISITNUM</td><td>Visit Number</td><td>Num</td><td>来院番号</td></tr>
<tr><td>VISIT</td><td>Visit Name</td><td>Char</td><td>来院名称</td></tr>
<tr><td>TVSTRL</td><td>Visit Start Rule</td><td>Char</td><td>来院開始のルール（例: Study Day 1）</td></tr>
<tr><td>TVENRL</td><td>Visit End Rule</td><td>Char</td><td>来院終了のルール</td></tr>
</tbody>
</table>

<h3>TV データ例</h3>
<table>
<thead>
<tr><th>VISITNUM</th><th>VISIT</th><th>TVSTRL</th><th>TVENRL</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>Screening</td><td>Informed consent signed</td><td>Day -28 to Day -1</td></tr>
<tr><td>2</td><td>Baseline / Day 1</td><td>Start of treatment (Day 1)</td><td>Day 1</td></tr>
<tr><td>3</td><td>Week 4</td><td>Day 29 +/- 3 days</td><td>Day 29 +/- 3 days</td></tr>
<tr><td>4</td><td>Week 8</td><td>Day 57 +/- 3 days</td><td>Day 57 +/- 3 days</td></tr>
<tr><td>5</td><td>Week 12 / End of Treatment</td><td>Day 85 +/- 3 days</td><td>Day 85 +/- 3 days</td></tr>
<tr><td>6</td><td>Follow-up</td><td>Day 113 +/- 7 days</td><td>Day 113 +/- 7 days</td></tr>
</tbody>
</table>

<h2>TI（Trial Inclusion/Exclusion Criteria）ドメイン</h2>
<p>TIドメインは、試験レベルの選択基準・除外基準を定義します。構造は<strong>1レコード = 1基準項目</strong>です。被験者レベルの基準充足状況はIEドメインに記録されます。</p>

<h3>TIドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>試験識別子</td></tr>
<tr><td>DOMAIN</td><td>Domain Abbreviation</td><td>Char</td><td>"TI"</td></tr>
<tr><td>IETESTCD</td><td>Inclusion/Exclusion Criterion Short Name</td><td>Char</td><td>基準の短縮名（例: INCL01）</td></tr>
<tr><td>IETEST</td><td>Inclusion/Exclusion Criterion</td><td>Char</td><td>基準の全文</td></tr>
<tr><td>IECAT</td><td>Inclusion/Exclusion Category</td><td>Char</td><td>INCLUSION または EXCLUSION</td></tr>
<tr><td>IESCAT</td><td>Inclusion/Exclusion Subcategory</td><td>Char</td><td>サブカテゴリ（任意）</td></tr>
</tbody>
</table>

<h3>TI データ例</h3>
<table>
<thead>
<tr><th>IETESTCD</th><th>IETEST</th><th>IECAT</th><th>IESCAT</th></tr>
</thead>
<tbody>
<tr><td>INCL01</td><td>Age 18 years or older at time of informed consent</td><td>INCLUSION</td><td>DEMOGRAPHICS</td></tr>
<tr><td>INCL02</td><td>Diagnosis of type 2 diabetes mellitus</td><td>INCLUSION</td><td>DIAGNOSIS</td></tr>
<tr><td>INCL03</td><td>HbA1c between 7.0% and 10.0% at screening</td><td>INCLUSION</td><td>LABORATORY</td></tr>
<tr><td>EXCL01</td><td>History of type 1 diabetes mellitus</td><td>EXCLUSION</td><td>MEDICAL HISTORY</td></tr>
<tr><td>EXCL02</td><td>Pregnant or nursing women</td><td>EXCLUSION</td><td>DEMOGRAPHICS</td></tr>
<tr><td>EXCL03</td><td>Severe hepatic impairment (Child-Pugh C)</td><td>EXCLUSION</td><td>MEDICAL HISTORY</td></tr>
</tbody>
</table>

<h3>Phase III並行群間比較試験の実践例</h3>
<p>以下は、2型糖尿病患者を対象としたPhase III試験の試験デザインの全体像です。</p>

<div class="info-box tip">
<div class="info-box-title">試験デザイン概要</div>
<ul>
<li><strong>試験デザイン</strong>: 多施設共同、ランダム化、二重盲検、プラセボ対照、3群並行群間比較試験</li>
<li><strong>対象</strong>: 2型糖尿病患者</li>
<li><strong>投与群</strong>: Placebo、Low Dose (50mg)、High Dose (100mg)</li>
<li><strong>期間</strong>: スクリーニング4週間 + 治療12週間 + 追跡4週間</li>
</ul>
</div>

<h3>Trial Designドメイン一覧</h3>
<table>
<thead>
<tr><th>ドメイン</th><th>レコード数の決定因子</th><th>被験者データ</th><th>必須/任意</th></tr>
</thead>
<tbody>
<tr><td>TA</td><td>Arm数 × 各ArmのElement数</td><td>いいえ（試験レベル）</td><td>必須</td></tr>
<tr><td>TE</td><td>ユニークなElement数</td><td>いいえ（試験レベル）</td><td>必須</td></tr>
<tr><td>TV</td><td>計画Visit数</td><td>いいえ（試験レベル）</td><td>必須</td></tr>
<tr><td>TI</td><td>選択・除外基準の項目数</td><td>いいえ（試験レベル）</td><td>任意</td></tr>
<tr><td>TS</td><td>試験概要パラメータ数</td><td>いいえ（試験レベル）</td><td>必須</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">注意</div>
Trial Designドメインは試験全体で共通のデータです。被験者ごとのデータではないため、USUBJIDは含みません。被験者の実際の経過はSEドメイン、適格性の結果はIEドメインに記録します。
</div>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* TA ドメインの作成例（3群並行デザイン） */
data ta;
    length STUDYID $20 DOMAIN $2 ARMCD $10 ARM $40
           ETCD $8 ELEMENT $40 EPOCH $20;
    STUDYID = "ABC-001";
    DOMAIN  = "TA";

    /* Placebo Arm */
    ARMCD="PBO"; ARM="Placebo";
    TAETORD=1; ETCD="SCRN"; ELEMENT="Screening"; EPOCH="SCREENING"; output;
    TAETORD=2; ETCD="PBO";  ELEMENT="Placebo Treatment"; EPOCH="TREATMENT"; output;
    TAETORD=3; ETCD="FU";   ELEMENT="Follow-up"; EPOCH="FOLLOW-UP"; output;

    /* Low Dose Arm */
    ARMCD="LOW"; ARM="Low Dose (50mg)";
    TAETORD=1; ETCD="SCRN";  ELEMENT="Screening"; EPOCH="SCREENING"; output;
    TAETORD=2; ETCD="LOW50"; ELEMENT="Low Dose 50mg Treatment"; EPOCH="TREATMENT"; output;
    TAETORD=3; ETCD="FU";    ELEMENT="Follow-up"; EPOCH="FOLLOW-UP"; output;

    /* High Dose Arm */
    ARMCD="HIGH"; ARM="High Dose (100mg)";
    TAETORD=1; ETCD="SCRN";  ELEMENT="Screening"; EPOCH="SCREENING"; output;
    TAETORD=2; ETCD="HI100"; ELEMENT="High Dose 100mg Treatment"; EPOCH="TREATMENT"; output;
    TAETORD=3; ETCD="FU";    ELEMENT="Follow-up"; EPOCH="FOLLOW-UP"; output;
run;

/* TE ドメインの作成例 */
data te;
    length STUDYID $20 DOMAIN $2 ETCD $8 ELEMENT $40
           TESTRL $200 TEENRL $200 TEDUR $10;
    STUDYID = "ABC-001";
    DOMAIN  = "TE";

    ETCD="SCRN"; ELEMENT="Screening";
    TESTRL="Informed consent signed";
    TEENRL="Screening evaluations completed and subject eligible";
    TEDUR="P28D"; output;

    ETCD="PBO"; ELEMENT="Placebo Treatment";
    TESTRL="Randomization";
    TEENRL="12 weeks of treatment completed or early discontinuation";
    TEDUR="P84D"; output;

    ETCD="LOW50"; ELEMENT="Low Dose 50mg Treatment";
    TESTRL="Randomization";
    TEENRL="12 weeks of treatment completed or early discontinuation";
    TEDUR="P84D"; output;

    ETCD="HI100"; ELEMENT="High Dose 100mg Treatment";
    TESTRL="Randomization";
    TEENRL="12 weeks of treatment completed or early discontinuation";
    TEDUR="P84D"; output;

    ETCD="FU"; ELEMENT="Follow-up";
    TESTRL="End of treatment";
    TEENRL="Follow-up visit completed";
    TEDUR="P28D"; output;
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q602_1",
                    type: "choice",
                    question: "Trial Designモデルを構成するドメインとして正しくないものはどれですか？",
                    options: ["TA（Trial Arms）", "TE（Trial Elements）", "TD（Trial Definitions）", "TV（Trial Visits）"],
                    answer: 2,
                    explanation: "TD（Trial Definitions）は存在しません。Trial Designモデルは TA, TE, TV, TI, TS の5つのドメインで構成されます。"
                },
                {
                    id: "q602_2",
                    type: "choice",
                    question: "TAドメインの1レコードは何を表しますか？",
                    options: [
                        "1つのArm全体",
                        "1つのArmの1つの計画Element",
                        "1被験者の1つのElement",
                        "1つのElementの定義"
                    ],
                    answer: 1,
                    explanation: "TAドメインの構造は1レコード = 1 Armの1計画Elementです。3群 × 3 Elementの場合、9レコードになります。"
                },
                {
                    id: "q602_3",
                    type: "fill",
                    question: "TEドメインでElementの計画期間を格納する変数名は何ですか？",
                    answer: "TEDUR",
                    explanation: "TEDUR（Planned Duration of Element）にISO 8601のDuration形式（例: P28D）で計画期間を格納します。"
                },
                {
                    id: "q602_4",
                    type: "choice",
                    question: "Trial Designドメインの特徴として正しいものはどれですか？",
                    options: [
                        "被験者ごとにレコードが作成される",
                        "USUBJIDを必ず含む",
                        "試験レベルのメタデータであり被験者データではない",
                        "Special Purposeドメインに分類される"
                    ],
                    answer: 2,
                    explanation: "Trial Designドメインは試験全体で共通のメタデータです。被験者ごとのデータではないため、USUBJIDは含みません。"
                },
                {
                    id: "q602_5",
                    type: "choice",
                    question: "TEドメインのTESTRL変数の役割は何ですか？",
                    options: [
                        "Elementのテスト結果を格納する",
                        "Elementの開始条件（遷移ルール）を記述する",
                        "Elementの統計検定の結果を格納する",
                        "Elementの開始日時を格納する"
                    ],
                    answer: 1,
                    explanation: "TESTRL（Rule for Start of Element）はElementの開始条件を記述する遷移ルールです。例えば'Informed consent signed'や'Randomization'などの条件をテキストで記述します。"
                }
            ]
        },
        {
            id: 603,
            title: "TS（試験概要）ドメイン",
            duration: "15分",
            content: `
<h2>TS（Trial Summary）ドメインの概要</h2>
<p>TSドメインは、臨床試験の概要情報を<strong>パラメータ形式</strong>で格納するドメインです。構造は<strong>1レコード = 1試験概要パラメータ</strong>であり、試験のデザイン、対象疾患、フェーズなどの基本情報を体系的に記述します。</p>
<p>FDAへの電子申請においてTSドメインは<strong>必須</strong>であり、試験の全体像を迅速に理解するための重要なデータセットです。</p>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
TSドメインは試験全体で1つのデータセットであり、被験者レベルのデータは含みません。FDAのeStudy Dataポータルでは、TSデータを使用して試験の検索やフィルタリングが行われます。
</div>

<h3>TSドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>試験識別子</td></tr>
<tr><td>DOMAIN</td><td>Domain Abbreviation</td><td>Char</td><td>"TS"</td></tr>
<tr><td>TSSEQ</td><td>Sequence Number</td><td>Num</td><td>レコードの順序番号</td></tr>
<tr><td>TSGRPID</td><td>Group ID</td><td>Char</td><td>パラメータのグループID（同一パラメータの複数値用）</td></tr>
<tr><td>TSPARMCD</td><td>Trial Summary Parameter Short Name</td><td>Char</td><td>パラメータの短縮コード</td></tr>
<tr><td>TSPARM</td><td>Trial Summary Parameter</td><td>Char</td><td>パラメータの正式名称</td></tr>
<tr><td>TSVAL</td><td>Parameter Value</td><td>Char</td><td>パラメータの値</td></tr>
<tr><td>TSVALNF</td><td>Parameter Null Flavor</td><td>Char</td><td>値が設定できない理由（例: NA, NI, UNK）</td></tr>
<tr><td>TSVALCD</td><td>Parameter Value Code</td><td>Char</td><td>パラメータ値のコード（CT使用時）</td></tr>
</tbody>
</table>

<h3>重要なTSPARMCDパラメータ一覧</h3>
<p>以下は、FDAが要求する主要なTSパラメータです。</p>
<table>
<thead>
<tr><th>TSPARMCD</th><th>TSPARM</th><th>説明</th><th>値の例</th></tr>
</thead>
<tbody>
<tr><td>ADDON</td><td>Added on to Existing Treatments</td><td>既存治療への追加かどうか</td><td>Y / N</td></tr>
<tr><td>AGEMAX</td><td>Planned Maximum Age of Subjects</td><td>計画された被験者最大年齢</td><td>P75Y</td></tr>
<tr><td>AGEMIN</td><td>Planned Minimum Age of Subjects</td><td>計画された被験者最小年齢</td><td>P18Y</td></tr>
<tr><td>COMPTRT</td><td>Comparator Treatment</td><td>対照治療</td><td>PLACEBO</td></tr>
<tr><td>INDIC</td><td>Trial Disease/Condition Indication</td><td>対象疾患・適応症</td><td>Type 2 Diabetes Mellitus</td></tr>
<tr><td>INTTYPE</td><td>Intervention Type</td><td>介入の種類</td><td>DRUG</td></tr>
<tr><td>LENGTH</td><td>Trial Length</td><td>試験期間</td><td>P20W</td></tr>
<tr><td>NARMS</td><td>Planned Number of Arms</td><td>計画されたArm数</td><td>3</td></tr>
<tr><td>PCLAS</td><td>Pharmacologic Class</td><td>薬効分類</td><td>Dipeptidyl Peptidase 4 Inhibitor</td></tr>
<tr><td>PLTEFN</td><td>Planned Treatment End of Trial Number</td><td>計画された投与終了時の被験者数</td><td>300</td></tr>
<tr><td>RANDOM</td><td>Trial is Randomized</td><td>ランダム化の有無</td><td>Y</td></tr>
<tr><td>SDESIGN</td><td>Trial Summary Design</td><td>試験デザインの種類</td><td>PARALLEL</td></tr>
<tr><td>SPONSOR</td><td>Clinical Study Sponsor</td><td>治験依頼者</td><td>ABC Pharma Inc.</td></tr>
<tr><td>TBLIND</td><td>Trial Blinding Schema</td><td>盲検化の種類</td><td>DOUBLE BLIND</td></tr>
<tr><td>TCNTRL</td><td>Control Type</td><td>対照の種類</td><td>PLACEBO</td></tr>
<tr><td>TDIGRP</td><td>Diagnosis Group</td><td>診断群</td><td>Type 2 Diabetes Mellitus</td></tr>
<tr><td>TINDTP</td><td>Trial Intent Type</td><td>試験の目的タイプ</td><td>TREATMENT</td></tr>
<tr><td>TITLE</td><td>Trial Title</td><td>試験名称</td><td>A Phase III Study of Drug X...</td></tr>
<tr><td>TPHASE</td><td>Trial Phase Classification</td><td>試験フェーズ</td><td>PHASE III TRIAL</td></tr>
<tr><td>TTYPE</td><td>Trial Type</td><td>試験の種類</td><td>EFFICACY / SAFETY</td></tr>
</tbody>
</table>

<h3>Controlled Terminology</h3>
<p>TSパラメータの多くにはControlled Terminology（統制用語）が定義されています。</p>
<div class="info-box warning">
<div class="info-box-title">注意</div>
<p>TSVALには自由テキストの値を格納しますが、対応するControlled Terminologyが存在する場合は、TSVALCDにCTのコード値を設定する必要があります。</p>
<p>例えば、TPHASE = "PHASE III TRIAL" の場合、TSVALCDにはCDISC CTの該当コードを設定します。</p>
<p>値が該当しない場合はTSVALNFにNull Flavor（NA, NI, UNK等）を設定します。</p>
</div>

<h3>FDA要件</h3>
<p>FDAは電子申請（eCTD）においてTSドメインの提出を必須としています。以下の点に注意が必要です。</p>
<ul>
<li>FDA Study Data Technical Conformance Guideで指定されたパラメータは<strong>すべて</strong>含める必要がある</li>
<li>該当しないパラメータもレコードを作成し、TSVALNFに適切なNull Flavorを設定する</li>
<li>CDISCのControlled Terminologyの最新版を使用する</li>
<li>TSVAL の値はControlled Terminology に準拠する</li>
</ul>

<h3>TS データ例（Phase III試験）</h3>
<table>
<thead>
<tr><th>TSSEQ</th><th>TSPARMCD</th><th>TSPARM</th><th>TSVAL</th><th>TSVALNF</th><th>TSVALCD</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>TITLE</td><td>Trial Title</td><td>A Phase III, Randomized, Double-Blind, Placebo-Controlled Study of Drug X in Patients with Type 2 Diabetes Mellitus</td><td></td><td></td></tr>
<tr><td>2</td><td>TPHASE</td><td>Trial Phase Classification</td><td>PHASE III TRIAL</td><td></td><td>C49686</td></tr>
<tr><td>3</td><td>INDIC</td><td>Trial Disease/Condition Indication</td><td>Type 2 Diabetes Mellitus</td><td></td><td>C26747</td></tr>
<tr><td>4</td><td>SDESIGN</td><td>Trial Summary Design</td><td>PARALLEL</td><td></td><td>C82639</td></tr>
<tr><td>5</td><td>RANDOM</td><td>Trial is Randomized</td><td>Y</td><td></td><td></td></tr>
<tr><td>6</td><td>TBLIND</td><td>Trial Blinding Schema</td><td>DOUBLE BLIND</td><td></td><td>C15228</td></tr>
<tr><td>7</td><td>TCNTRL</td><td>Control Type</td><td>PLACEBO</td><td></td><td>C49648</td></tr>
<tr><td>8</td><td>NARMS</td><td>Planned Number of Arms</td><td>3</td><td></td><td></td></tr>
<tr><td>9</td><td>LENGTH</td><td>Trial Length</td><td>P20W</td><td></td><td></td></tr>
<tr><td>10</td><td>AGEMIN</td><td>Planned Minimum Age of Subjects</td><td>P18Y</td><td></td><td></td></tr>
<tr><td>11</td><td>AGEMAX</td><td>Planned Maximum Age of Subjects</td><td>P75Y</td><td></td><td></td></tr>
<tr><td>12</td><td>SPONSOR</td><td>Clinical Study Sponsor</td><td>ABC Pharma Inc.</td><td></td><td></td></tr>
<tr><td>13</td><td>INTTYPE</td><td>Intervention Type</td><td>DRUG</td><td></td><td>C1909</td></tr>
<tr><td>14</td><td>ADDON</td><td>Added on to Existing Treatments</td><td>N</td><td></td><td></td></tr>
</tbody>
</table>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* TS ドメインの作成例 */
data ts;
    length STUDYID $20 DOMAIN $2 TSSEQ 8
           TSPARMCD $8 TSPARM $40 TSVAL $200
           TSVALNF $2 TSVALCD $20;
    STUDYID = "ABC-001";
    DOMAIN  = "TS";

    TSSEQ=1; TSPARMCD="TITLE"; TSPARM="Trial Title";
    TSVAL="A Phase III, Randomized, Double-Blind, Placebo-Controlled Study";
    TSVALNF=""; TSVALCD=""; output;

    TSSEQ=2; TSPARMCD="TPHASE"; TSPARM="Trial Phase Classification";
    TSVAL="PHASE III TRIAL"; TSVALNF=""; TSVALCD="C49686"; output;

    TSSEQ=3; TSPARMCD="INDIC"; TSPARM="Trial Disease/Condition Indication";
    TSVAL="Type 2 Diabetes Mellitus"; TSVALNF=""; TSVALCD="C26747"; output;

    TSSEQ=4; TSPARMCD="SDESIGN"; TSPARM="Trial Summary Design";
    TSVAL="PARALLEL"; TSVALNF=""; TSVALCD="C82639"; output;

    TSSEQ=5; TSPARMCD="RANDOM"; TSPARM="Trial is Randomized";
    TSVAL="Y"; TSVALNF=""; TSVALCD=""; output;

    TSSEQ=6; TSPARMCD="TBLIND"; TSPARM="Trial Blinding Schema";
    TSVAL="DOUBLE BLIND"; TSVALNF=""; TSVALCD="C15228"; output;

    TSSEQ=7; TSPARMCD="NARMS"; TSPARM="Planned Number of Arms";
    TSVAL="3"; TSVALNF=""; TSVALCD=""; output;
run;</code></pre></div>
`,
            quiz: [
                {
                    id: "q603_1",
                    type: "choice",
                    question: "TSドメインの1レコードは何を表しますか？",
                    options: [
                        "1被験者の試験概要",
                        "1試験の全概要情報",
                        "1試験概要パラメータ",
                        "1試験サイトの情報"
                    ],
                    answer: 2,
                    explanation: "TSドメインは1レコード = 1試験概要パラメータの構造です。試験フェーズ、対象疾患などのパラメータがそれぞれ1レコードとなります。"
                },
                {
                    id: "q603_2",
                    type: "fill",
                    question: "TSドメインで試験フェーズを示すパラメータコード（TSPARMCD）は何ですか？",
                    answer: "TPHASE",
                    explanation: "TPHASE（Trial Phase Classification）が試験フェーズを示すパラメータコードです。値の例: 'PHASE III TRIAL'。"
                },
                {
                    id: "q603_3",
                    type: "choice",
                    question: "TSパラメータの値が該当しない場合、どの変数にNull Flavorを設定しますか？",
                    options: ["TSVAL", "TSVALNF", "TSVALCD", "TSGRPID"],
                    answer: 1,
                    explanation: "TSVALNF（Parameter Null Flavor）に値が設定できない理由を示すNull Flavor（NA, NI, UNK等）を設定します。"
                },
                {
                    id: "q603_4",
                    type: "choice",
                    question: "FDAの電子申請においてTSドメインの取り扱いとして正しいものはどれですか？",
                    options: [
                        "TSドメインは任意であり提出しなくてもよい",
                        "TSドメインは必須であり、該当しないパラメータも含める必要がある",
                        "TSドメインは Phase III 試験のみで必須である",
                        "TSドメインはADaMデータセットとして提出する"
                    ],
                    answer: 1,
                    explanation: "FDAはTSドメインの提出を必須としています。該当しないパラメータもレコードを作成し、TSVALNFにNull Flavorを設定する必要があります。"
                }
            ]
        },
        {
            id: 604,
            title: "IE（適格性）ドメイン",
            duration: "15分",
            content: `
<h2>IE（Inclusion/Exclusion Criteria Not Met）ドメインの概要</h2>
<p>IEドメインは<strong>Interventionsクラス</strong>に分類され、各被験者の選択基準・除外基準の<strong>逸脱（違反）</strong>を記録するドメインです。構造は<strong>1レコード = 1被験者の1基準逸脱</strong>です。</p>
<p>重要な点として、IEドメインは<strong>すべての被験者のすべての基準を記録するのではなく</strong>、基準を満たさなかった（逸脱した）ケースのみを記録します。</p>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
IEドメインは被験者レベルの適格性逸脱データです。試験レベルの基準定義はTI（Trial Inclusion/Exclusion Criteria）ドメインに格納されます。この2つのドメインの違いを理解することが重要です。
</div>

<h3>TI ドメインと IE ドメインの違い</h3>
<table>
<thead>
<tr><th>特徴</th><th>TI（Trial Inclusion/Exclusion）</th><th>IE（Inclusion/Exclusion Not Met）</th></tr>
</thead>
<tbody>
<tr><td>レベル</td><td>試験レベル</td><td>被験者レベル</td></tr>
<tr><td>内容</td><td>基準の定義</td><td>基準の逸脱記録</td></tr>
<tr><td>USUBJID</td><td>含まない</td><td>含む</td></tr>
<tr><td>レコード数</td><td>基準項目数</td><td>逸脱のあった被験者 x 逸脱基準数</td></tr>
<tr><td>目的</td><td>試験の基準を記述</td><td>逸脱を記録</td></tr>
</tbody>
</table>

<h3>IEドメインの主要変数</h3>
<table>
<thead>
<tr><th>Variable Name</th><th>Label</th><th>Type</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>試験識別子</td></tr>
<tr><td>DOMAIN</td><td>Domain Abbreviation</td><td>Char</td><td>"IE"</td></tr>
<tr><td>USUBJID</td><td>Unique Subject Identifier</td><td>Char</td><td>被験者固有識別子</td></tr>
<tr><td>IESEQ</td><td>Sequence Number</td><td>Num</td><td>レコードの順序番号</td></tr>
<tr><td>IETESTCD</td><td>Inclusion/Exclusion Criterion Short Name</td><td>Char</td><td>基準の短縮名（TIのIETESTCDと対応）</td></tr>
<tr><td>IETEST</td><td>Inclusion/Exclusion Criterion</td><td>Char</td><td>基準の全文</td></tr>
<tr><td>IECAT</td><td>Inclusion/Exclusion Category</td><td>Char</td><td>INCLUSION または EXCLUSION</td></tr>
<tr><td>IESCAT</td><td>Inclusion/Exclusion Subcategory</td><td>Char</td><td>サブカテゴリ（任意）</td></tr>
<tr><td>IEORRES</td><td>Original Result</td><td>Char</td><td>基準充足結果（Y = 充足、N = 未充足）</td></tr>
<tr><td>IESTRESC</td><td>Character Result/Finding in Standard Format</td><td>Char</td><td>標準形式の結果</td></tr>
<tr><td>IEDTC</td><td>Date/Time of Collection</td><td>Char</td><td>評価日時（ISO 8601）</td></tr>
</tbody>
</table>

<h3>IEドメインの記録パターン</h3>
<p>IEドメインでは、基準の逸脱パターンに応じて以下のように記録します。</p>

<div class="info-box warning">
<div class="info-box-title">注意</div>
<p>IEドメインに記録するのは<strong>基準を満たさなかった（逸脱した）ケースのみ</strong>です。</p>
<ul>
<li><strong>選択基準の逸脱</strong>: IECAT = "INCLUSION"、IEORRES = "N"（基準を満たしていない）</li>
<li><strong>除外基準の逸脱</strong>: IECAT = "EXCLUSION"、IEORRES = "Y"（該当してしまった）</li>
</ul>
<p>すべての基準を正常に満たした被験者はIEドメインにレコードを持ちません。</p>
</div>

<h3>IECAT と IEORRES の解釈</h3>
<table>
<thead>
<tr><th>IECAT</th><th>IEORRES</th><th>意味</th><th>IEドメインに記録</th></tr>
</thead>
<tbody>
<tr><td>INCLUSION</td><td>Y</td><td>選択基準を満たす（正常）</td><td>記録しない</td></tr>
<tr><td>INCLUSION</td><td>N</td><td>選択基準を満たさない（逸脱）</td><td>記録する</td></tr>
<tr><td>EXCLUSION</td><td>N</td><td>除外基準に該当しない（正常）</td><td>記録しない</td></tr>
<tr><td>EXCLUSION</td><td>Y</td><td>除外基準に該当する（逸脱）</td><td>記録する</td></tr>
</tbody>
</table>

<h3>データ例</h3>
<p>以下は、適格性逸脱のあった被験者のIEデータ例です。</p>
<table>
<thead>
<tr><th>USUBJID</th><th>IESEQ</th><th>IETESTCD</th><th>IETEST</th><th>IECAT</th><th>IEORRES</th><th>IESTRESC</th><th>IEDTC</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-010</td><td>1</td><td>INCL03</td><td>HbA1c between 7.0% and 10.0% at screening</td><td>INCLUSION</td><td>N</td><td>N</td><td>2024-02-05</td></tr>
<tr><td>ABC-001-015</td><td>1</td><td>EXCL01</td><td>History of type 1 diabetes mellitus</td><td>EXCLUSION</td><td>Y</td><td>Y</td><td>2024-03-10</td></tr>
<tr><td>ABC-001-015</td><td>2</td><td>INCL01</td><td>Age 18 years or older at time of informed consent</td><td>INCLUSION</td><td>N</td><td>N</td><td>2024-03-10</td></tr>
<tr><td>ABC-001-022</td><td>1</td><td>EXCL03</td><td>Severe hepatic impairment (Child-Pugh C)</td><td>EXCLUSION</td><td>Y</td><td>Y</td><td>2024-04-01</td></tr>
</tbody>
</table>

<h3>プロトコル逸脱との関係</h3>
<p>IEドメインに記録された逸脱は、プロトコル逸脱として報告される場合があります。</p>
<ul>
<li>スクリーニング時に発見された逸脱: 通常はScreen Failureとして処理</li>
<li>投与開始後に発見された逸脱: プロトコル逸脱として報告し、解析集団への影響を評価</li>
<li>逸脱にもかかわらず組み入れられた被験者: protocol deviationログとIEドメインの両方に記録</li>
</ul>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
<p>IEドメインのデータは以下の解析で使用されます。</p>
<ul>
<li><strong>解析集団の定義</strong>: 適格性逸脱のある被験者をper-protocol集団から除外</li>
<li><strong>感度分析</strong>: 逸脱被験者を含めた/除外した場合の結果比較</li>
<li><strong>規制当局への報告</strong>: 重大なプロトコル逸脱の一覧</li>
</ul>
</div>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* IE ドメインの作成例 - 逸脱のある被験者のみ */
data ie;
    set raw.ie_violations;
    length STUDYID $20 DOMAIN $2 USUBJID $40
           IETESTCD $8 IETEST $200 IECAT $20
           IESCAT $40 IEORRES $2 IESTRESC $2;

    STUDYID = "ABC-001";
    DOMAIN  = "IE";

    /* 逸脱レコードのみ出力 */
    /* 選択基準を満たさない場合: IEORRES = "N" */
    /* 除外基準に該当する場合: IEORRES = "Y" */
    if (IECAT = "INCLUSION" and IEORRES = "N") or
       (IECAT = "EXCLUSION" and IEORRES = "Y");

    IESTRESC = IEORRES;
run;

/* TI と IE の関連チェック */
proc sql;
    title "IE violations matched with TI criteria";
    select ie.USUBJID, ie.IETESTCD, ti.IETEST,
           ie.IECAT, ie.IEORRES, ie.IEDTC
    from ie
    inner join ti
        on ie.STUDYID = ti.STUDYID
        and ie.IETESTCD = ti.IETESTCD
    order by ie.USUBJID, ie.IESEQ;
quit;</code></pre></div>
`,
            quiz: [
                {
                    id: "q604_1",
                    type: "choice",
                    question: "IEドメインに記録されるのはどのようなデータですか？",
                    options: [
                        "すべての被験者のすべての適格性基準の結果",
                        "適格性基準を満たさなかった（逸脱した）ケースのみ",
                        "Screen Failureの被験者のデータのみ",
                        "試験レベルの選択・除外基準の定義"
                    ],
                    answer: 1,
                    explanation: "IEドメインには適格性基準の逸脱（違反）のみを記録します。すべての基準を満たした被験者はIEドメインにレコードを持ちません。"
                },
                {
                    id: "q604_2",
                    type: "choice",
                    question: "除外基準に該当してしまった場合のIEORRESの値は何ですか？",
                    options: ["N", "Y", "FAIL", "VIOLATION"],
                    answer: 1,
                    explanation: "除外基準に該当した場合はIEORRES = 'Y'です。除外基準は「該当しない」ことが正常なので、'Y'は逸脱を意味します。"
                },
                {
                    id: "q604_3",
                    type: "choice",
                    question: "試験レベルの選択・除外基準の定義を格納するドメインはどれですか？",
                    options: ["IE", "TI", "TS", "DM"],
                    answer: 1,
                    explanation: "TI（Trial Inclusion/Exclusion Criteria）ドメインが試験レベルの基準定義を格納します。IEは被験者レベルの逸脱記録です。"
                },
                {
                    id: "q604_4",
                    type: "fill",
                    question: "IEドメインで基準のカテゴリを示す変数名は何ですか？",
                    answer: "IECAT",
                    explanation: "IECAT（Inclusion/Exclusion Category）に'INCLUSION'または'EXCLUSION'の値を設定して基準のカテゴリを示します。"
                }
            ]
        }
    ]
};
