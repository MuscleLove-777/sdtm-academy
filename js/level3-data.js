// =============================================================================
// SDTM Academy - Level 3: SDTMプログラミング
// =============================================================================
// SASとRによるSDTMデータセット作成の実践的プログラミング技法を学ぶ
// =============================================================================

const LEVEL3_DATA = {
    id: 3,
    title: "SDTMプログラミング",
    icon: "\uD83D\uDCBB",
    description: "SASとRによるSDTMデータセット作成を学ぶ",
    modules: [
        // =====================================================================
        // Module 16: SASによるSDTM作成 (id: 301)
        // =====================================================================
        {
            id: 301,
            title: "SASによるSDTM作成",
            duration: "35分",
            content: `
<h2>SASによるSDTMデータセット作成</h2>

<h3>1. SASプログラミング環境の準備</h3>
<p>SDTMデータセットをSASで作成するには、まず適切な環境設定が必要です。ライブラリの定義、フォーマットの設定、オプションの指定を行います。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/*--- SDTM Programming Environment Setup ---*/

/* グローバルオプションの設定 */
options nofmterr msglevel=i validvarname=v7 compress=yes;

/* ライブラリ定義 */
libname raw    "C:/study/CDISCPILOT01/raw"    access=readonly;  /* 生データ */
libname sdtm   "C:/study/CDISCPILOT01/sdtm";                    /* SDTM出力先 */
libname fmtlib "C:/study/CDISCPILOT01/formats";                  /* フォーマット */

/* Controlled Terminologyフォーマットの読み込み */
options fmtsearch=(fmtlib work);

/* SDTMで使用する定数をマクロ変数に設定 */
%let STUDYID = CDISCPILOT01;
%let DOMAIN  = ;  /* 各ドメインで設定 */
</code></pre></div>

<h3>2. 生データの読み込み</h3>
<p>CRFから収集された生データやEDCデータを読み込みます。SASデータセット、CSV、Excelなど、さまざまな形式に対応できます。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/* SASデータセットの読み込み（既存SASデータ） */
data work.demog_raw;
    set raw.demographics;
run;

/* CSVファイルの読み込み */
proc import datafile="C:/study/CDISCPILOT01/raw/demographics.csv"
    out=work.demog_csv
    dbms=csv replace;
    guessingrows=max;
run;

/* Excelファイルの読み込み */
proc import datafile="C:/study/CDISCPILOT01/raw/demographics.xlsx"
    out=work.demog_xlsx
    dbms=xlsx replace;
    sheet="Sheet1";
run;

/* 固定長ファイルの読み込み */
data work.demog_fixed;
    infile "C:/study/CDISCPILOT01/raw/demographics.dat" lrecl=200;
    input @1  subjid   $10.
          @11 site     $4.
          @15 brthdt   yymmdd10.
          @25 sex      $1.
          @26 race     $40.;
    format brthdt yymmdd10.;
run;
</code></pre></div>

<h3>3. DMドメインの作成</h3>
<p>DM（Demographics）ドメインは最も基本的なSDTMドメインです。全ての被験者に1レコードずつ存在し、人口統計学的情報を格納します。以下に、生データからDMドメインを作成する完全な例を示します。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/*=============================================================*/
/* DM Domain Creation - Demographics                            */
/*=============================================================*/
%let DOMAIN = DM;

/* Step 1: 生データを読み込み、基本変数を準備 */
proc sort data=raw.demographics out=dm_raw;
    by subjid;
run;

/* Step 2: RFSTDTCとRFENDTCを他ドメインから取得 */
/* 投与開始日（最初の投薬日）をEXドメインから取得 */
proc sql noprint;
    create table rf_dates as
    select subjid,
           min(exstdtc) as rfstdtc length=19,
           max(exendtc) as rfendtc length=19
    from raw.exposure
    group by subjid;
quit;

/* Step 3: DMドメインのマッピング */
data sdtm.dm(label="Demographics");
    attrib
        STUDYID  label="Study Identifier"           length=$20
        DOMAIN   label="Domain Abbreviation"         length=$2
        USUBJID  label="Unique Subject Identifier"   length=$40
        SUBJID   label="Subject Identifier for the Study" length=$20
        RFSTDTC  label="Subject Reference Start Date/Time" length=$19
        RFENDTC  label="Subject Reference End Date/Time"   length=$19
        RFXSTDTC label="Date/Time of First Study Treatment" length=$19
        RFXENDTC label="Date/Time of Last Study Treatment"  length=$19
        RFICDTC  label="Date/Time of Informed Consent"     length=$19
        RFPENDTC label="Date/Time of End of Participation" length=$19
        DTHDTC   label="Date/Time of Death"          length=$19
        DTHFL    label="Subject Death Flag"           length=$1
        SITEID   label="Study Site Identifier"       length=$10
        BRTHDTC  label="Date/Time of Birth"          length=$19
        AGE      label="Age"                          length=8
        AGEU     label="Age Units"                    length=$10
        SEX      label="Sex"                          length=$1
        RACE     label="Race"                         length=$60
        ETHNIC   label="Ethnicity"                    length=$40
        ARMCD    label="Planned Arm Code"             length=$20
        ARM      label="Description of Planned Arm"  length=$200
        ACTARMCD label="Actual Arm Code"              length=$20
        ACTARM   label="Description of Actual Arm"   length=$200
        COUNTRY  label="Country"                      length=$3
        DMDTC    label="Date/Time of Collection"      length=$19
        DMDY     label="Study Day of Collection"      length=8
    ;

    merge dm_raw(in=a) rf_dates(in=b);
    by subjid;
    if a;

    /* 固定値の設定 */
    STUDYID = "&amp;STUDYID";
    DOMAIN  = "&amp;DOMAIN";

    /* USUBJIDの作成: STUDYID + "-" + SITEID + "-" + SUBJID */
    SITEID  = strip(put(site, best.));
    USUBJID = catx("-", STUDYID, SITEID, SUBJID);

    /* 参照日の設定 */
    RFXSTDTC = RFSTDTC;
    RFXENDTC = RFENDTC;
    RFICDTC  = put(datepart(ic_date), yymmdd10.);

    /* 死亡情報の設定 */
    if not missing(death_date) then do;
        DTHDTC = put(datepart(death_date), yymmdd10.);
        DTHFL  = "Y";
    end;

    /* 生年月日とAGEの計算 */
    BRTHDTC = put(datepart(birth_date), yymmdd10.);
    AGE     = intck('year', datepart(birth_date), datepart(ic_date));
    AGEU    = "YEARS";

    /* SEX: Controlled Terminologyへのマッピング */
    select(upcase(strip(sex_raw)));
        when("MALE", "M")   SEX = "M";
        when("FEMALE", "F") SEX = "F";
        when("UNDIFF", "U") SEX = "U";
        otherwise            SEX = "";
    end;

    /* RACE: Controlled Terminologyへのマッピング */
    select(upcase(strip(race_raw)));
        when("WHITE", "CAUCASIAN")
            RACE = "WHITE";
        when("BLACK", "AFRICAN AMERICAN", "BLACK OR AFRICAN AMERICAN")
            RACE = "BLACK OR AFRICAN AMERICAN";
        when("ASIAN")
            RACE = "ASIAN";
        when("AMERICAN INDIAN", "ALASKA NATIVE",
             "AMERICAN INDIAN OR ALASKA NATIVE")
            RACE = "AMERICAN INDIAN OR ALASKA NATIVE";
        when("HAWAIIAN", "PACIFIC ISLANDER",
             "NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDER")
            RACE = "NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDER";
        otherwise
            RACE = "OTHER";
    end;

    /* ETHNIC: Controlled Terminologyへのマッピング */
    select(upcase(strip(ethnic_raw)));
        when("HISPANIC", "HISPANIC OR LATINO")
            ETHNIC = "HISPANIC OR LATINO";
        when("NOT HISPANIC", "NOT HISPANIC OR LATINO")
            ETHNIC = "NOT HISPANIC OR LATINO";
        otherwise
            ETHNIC = "UNKNOWN";
    end;

    /* ARM/ACTARM の設定 */
    select(upcase(strip(trt_group)));
        when("PLACEBO") do;
            ARMCD    = "PBOGRP";
            ARM      = "Placebo";
            ACTARMCD = "PBOGRP";
            ACTARM   = "Placebo";
        end;
        when("LOW DOSE", "XANOMELINE LOW DOSE") do;
            ARMCD    = "XANLD";
            ARM      = "Xanomeline Low Dose";
            ACTARMCD = "XANLD";
            ACTARM   = "Xanomeline Low Dose";
        end;
        when("HIGH DOSE", "XANOMELINE HIGH DOSE") do;
            ARMCD    = "XANHD";
            ARM      = "Xanomeline High Dose";
            ACTARMCD = "XANHD";
            ACTARM   = "Xanomeline High Dose";
        end;
        otherwise do;
            ARMCD    = "";
            ARM      = "";
            ACTARMCD = "";
            ACTARM   = "";
        end;
    end;

    /* COUNTRY */
    COUNTRY = "USA";

    /* コレクション日 */
    DMDTC = put(datepart(collection_date), yymmdd10.);

    /* Study Day: DMDYの算出 */
    if not missing(DMDTC) and not missing(RFSTDTC) then do;
        _dmdtn   = input(DMDTC, yymmdd10.);
        _rfstn   = input(RFSTDTC, yymmdd10.);
        DMDY     = _dmdtn - _rfstn + (_dmdtn >= _rfstn);
    end;

    /* 必要な変数のみ保持 */
    keep STUDYID DOMAIN USUBJID SUBJID RFSTDTC RFENDTC RFXSTDTC RFXENDTC
         RFICDTC RFPENDTC DTHDTC DTHFL SITEID BRTHDTC AGE AGEU SEX RACE
         ETHNIC ARMCD ARM ACTARMCD ACTARM COUNTRY DMDTC DMDY;
run;
</code></pre></div>

<h3>4. AEドメインの作成</h3>
<p>AE（Adverse Events）ドメインは有害事象を記録する重要なドメインです。CRFの有害事象データにMedDRAコーディングを加え、Study Dayを算出します。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/*=============================================================*/
/* AE Domain Creation - Adverse Events                          */
/*=============================================================*/
%let DOMAIN = AE;

/* Step 1: 生AEデータとMedDRAコーディング結果を結合 */
proc sort data=raw.adverse_events out=ae_raw;
    by subjid ae_num;
run;

proc sort data=raw.meddra_coding out=meddra;
    by subjid ae_num;
run;

/* DMからRFSTDTC（参照日）を取得 */
proc sql noprint;
    create table dm_ref as
    select USUBJID, SUBJID, RFSTDTC
    from sdtm.dm;
quit;

/* Step 2: AEドメインの作成 */
data ae_mapped;
    attrib
        STUDYID  label="Study Identifier"            length=$20
        DOMAIN   label="Domain Abbreviation"          length=$2
        USUBJID  label="Unique Subject Identifier"    length=$40
        AESEQ    label="Sequence Number"              length=8
        AETERM   label="Reported Term for the Adverse Event"  length=$200
        AEDECOD  label="Dictionary-Derived Term"      length=$200
        AEBODSYS label="Body System or Organ Class"   length=$200
        AESEV    label="Severity/Intensity"            length=$10
        AESER    label="Serious Event"                 length=$1
        AEACN    label="Action Taken with Study Treatment" length=$40
        AEREL    label="Causality"                     length=$40
        AEOUT    label="Outcome of Adverse Event"      length=$60
        AESTDTC  label="Start Date/Time of Adverse Event"  length=$19
        AEENDTC  label="End Date/Time of Adverse Event"    length=$19
        AESTDY   label="Study Day of Start of Adverse Event"  length=8
        AEENDY   label="Study Day of End of Adverse Event"    length=8
        AEENRF   label="End Relative to Reference Period"     length=$10
    ;

    merge ae_raw(in=a) meddra(in=b) dm_ref(in=c);
    by subjid;
    if a and c;

    STUDYID = "&amp;STUDYID";
    DOMAIN  = "&amp;DOMAIN";

    /* AETERM: CRFの記載用語をそのまま使用 */
    AETERM = strip(ae_verbatim);

    /* MedDRA コーディング結果 */
    AEDECOD  = strip(meddra_pt);       /* Preferred Term */
    AEBODSYS = strip(meddra_soc);      /* System Organ Class */

    /* 重症度: Controlled Terminologyへのマッピング */
    select(upcase(strip(severity)));
        when("MILD")     AESEV = "MILD";
        when("MODERATE") AESEV = "MODERATE";
        when("SEVERE")   AESEV = "SEVERE";
        otherwise        AESEV = "";
    end;

    /* 重篤性 */
    if upcase(strip(serious_flag)) in ("YES", "Y") then AESER = "Y";
    else AESER = "N";

    /* 処置 */
    select(upcase(strip(action_taken)));
        when("NONE")              AEACN = "DOSE NOT CHANGED";
        when("DOSE REDUCED")      AEACN = "DOSE REDUCED";
        when("DRUG INTERRUPTED")  AEACN = "DRUG INTERRUPTED";
        when("DRUG WITHDRAWN")    AEACN = "DRUG WITHDRAWN";
        when("NOT APPLICABLE")    AEACN = "NOT APPLICABLE";
        otherwise                 AEACN = "";
    end;

    /* 因果関係 */
    select(upcase(strip(relationship)));
        when("RELATED", "PROBABLE", "POSSIBLE")
            AEREL = "POSSIBLY RELATED";
        when("NOT RELATED", "NONE", "UNLIKELY")
            AEREL = "NOT RELATED";
        otherwise AEREL = "";
    end;

    /* 転帰 */
    select(upcase(strip(outcome)));
        when("RECOVERED")             AEOUT = "RECOVERED/RESOLVED";
        when("RECOVERING")            AEOUT = "RECOVERING/RESOLVING";
        when("NOT RECOVERED")         AEOUT = "NOT RECOVERED/NOT RESOLVED";
        when("FATAL")                 AEOUT = "FATAL";
        when("RECOVERED WITH SEQUELAE") AEOUT = "RECOVERED/RESOLVED WITH SEQUELAE";
        otherwise                     AEOUT = "";
    end;

    /* 日付のISO 8601形式への変換 */
    if not missing(ae_start_date) then
        AESTDTC = put(datepart(ae_start_date), yymmdd10.);
    if not missing(ae_end_date) then
        AEENDTC = put(datepart(ae_end_date), yymmdd10.);

    /* Study Day（治験日数）の算出 */
    /* 公式: date - RFSTDTC + (date >= RFSTDTC) */
    /* Day 0は存在しない: Day -1 → Day 1 */
    if not missing(AESTDTC) and not missing(RFSTDTC) then do;
        _aestn = input(AESTDTC, yymmdd10.);
        _rfstn = input(RFSTDTC, yymmdd10.);
        AESTDY = _aestn - _rfstn + (_aestn >= _rfstn);
    end;

    if not missing(AEENDTC) and not missing(RFSTDTC) then do;
        _aeenn = input(AEENDTC, yymmdd10.);
        _rfstn = input(RFSTDTC, yymmdd10.);
        AEENDY = _aeenn - _rfstn + (_aeenn >= _rfstn);
    end;

    if missing(AEENDTC) then AEENRF = "ONGOING";
    else AEENRF = "";

    keep STUDYID DOMAIN USUBJID AESEQ AETERM AEDECOD AEBODSYS AESEV AESER
         AEACN AEREL AEOUT AESTDTC AEENDTC AESTDY AEENDY AEENRF;
run;

/* Step 3: AESEQの生成（被験者内で連番を付与） */
proc sort data=ae_mapped;
    by USUBJID AESTDTC AETERM;
run;

data sdtm.ae(label="Adverse Events");
    set ae_mapped;
    by USUBJID;
    if first.USUBJID then AESEQ = 0;
    AESEQ + 1;
run;
</code></pre></div>

<h3>5. 再利用可能なSASマクロ</h3>
<p>SDTMプログラミングでは、複数のドメインで共通する処理をマクロ化すると効率的です。特に<strong>--SEQ</strong>変数の生成と<strong>--DY</strong>（Study Day）の算出は頻繁に使用されます。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/*=============================================================*/
/* 再利用可能なSDTMマクロ                                        */
/*=============================================================*/

/* %sdtm_seq: --SEQ変数を生成するマクロ */
%macro sdtm_seq(dsin=, domain=, sortby=);
    proc sort data=&amp;dsin;
        by USUBJID &amp;sortby;
    run;

    data &amp;dsin;
        set &amp;dsin;
        by USUBJID;
        if first.USUBJID then &amp;domain.SEQ = 0;
        &amp;domain.SEQ + 1;
    run;
%mend sdtm_seq;

/* 使用例 */
/* %sdtm_seq(dsin=sdtm.ae, domain=AE, sortby=AESTDTC AETERM); */
/* %sdtm_seq(dsin=sdtm.cm, domain=CM, sortby=CMSTDTC CMTRT);  */

/*=============================================================*/
/* %sdtm_dy: Study Day (--DY) を算出するマクロ                   */
%macro sdtm_dy(dsin=, dtcvar=, dyvar=, refvar=RFSTDTC);
    data &amp;dsin;
        set &amp;dsin;
        if not missing(&amp;dtcvar) and not missing(&amp;refvar) then do;
            _dtcn = input(&amp;dtcvar, yymmdd10.);
            _refn = input(&amp;refvar, yymmdd10.);
            &amp;dyvar = _dtcn - _refn + (_dtcn >= _refn);
        end;
        drop _dtcn _refn;
    run;
%mend sdtm_dy;

/* 使用例 */
/* %sdtm_dy(dsin=sdtm.ae, dtcvar=AESTDTC, dyvar=AESTDY); */
/* %sdtm_dy(dsin=sdtm.ae, dtcvar=AEENDTC, dyvar=AEENDY); */
</code></pre></div>

<h3>6. QC（品質管理）: PROC COMPARE</h3>
<p>SDTMプログラミングでは、独立した2名のプログラマーがそれぞれ同じデータセットを作成し、結果を比較する<strong>ダブルプログラミング</strong>が標準的なQC手法です。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/* PROC COMPARE: プライマリ vs QCの比較 */
proc compare base=sdtm.dm compare=qc.dm
    listall maxprint=(50,500) criterion=0.00001;
    id USUBJID;
    title "QC Comparison: DM Domain";
run;

/* 結果の解釈:
   - "No unequal values" → QC通過
   - 差異がある場合 → 変数名と値が一覧表示される
   - NOTE: Values compared: XXX  Values not equal: 0  → OK
*/
</code></pre></div>

<h3>7. 変数の並び順と属性の最終設定</h3>
<p>SDTMデータセットでは、変数の並び順がSDTM IGで定義された順序に従う必要があります。RETAINとPROC DATASETSで最終設定します。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/* 変数の並び順を制御するRETAINステートメント */
data sdtm.dm(label="Demographics");
    retain STUDYID DOMAIN USUBJID SUBJID RFSTDTC RFENDTC RFXSTDTC RFXENDTC
           RFICDTC RFPENDTC DTHDTC DTHFL SITEID BRTHDTC AGE AGEU SEX RACE
           ETHNIC ARMCD ARM ACTARMCD ACTARM COUNTRY DMDTC DMDY;
    set sdtm.dm;
run;

/* PROC DATASETSで最終属性を設定 */
proc datasets lib=sdtm nolist;
    modify dm;
    attrib
        STUDYID  label="Study Identifier"           length=$20
        DOMAIN   label="Domain Abbreviation"         length=$2
        USUBJID  label="Unique Subject Identifier"   length=$40
        SUBJID   label="Subject Identifier for the Study" length=$20
        SEX      label="Sex"                          length=$1
        RACE     label="Race"                         length=$60
        AGE      label="Age"                          length=8
        AGEU     label="Age Units"                    length=$10
    ;
quit;

/* XPT (SAS Transport) ファイルの出力 */
libname xptout xport "C:/study/CDISCPILOT01/sdtm/dm.xpt";
proc copy in=sdtm out=xptout;
    select dm;
run;
</code></pre></div>

<div class="key-point">
    <div class="key-point-title">SASプログラミングのまとめ</div>
    <ul>
        <li><strong>DATA ステップ</strong>: マッピング、変数導出、CTマッピングの中心</li>
        <li><strong>PROC SQL</strong>: 複数データソースの結合、集約に便利</li>
        <li><strong>マクロ</strong>: --SEQ、--DYなど繰り返し処理を効率化</li>
        <li><strong>ATTRIB</strong>: ラベル、長さ、タイプの設定に必須</li>
        <li><strong>RETAIN</strong>: 変数の並び順を制御</li>
        <li><strong>PROC COMPARE</strong>: QCダブルプログラミングの比較ツール</li>
    </ul>
</div>
`,
            quiz: [
                {
                    id: "q301_1",
                    type: "choice",
                    question: "SASでUSUBJIDを作成するために適切な関数はどれですか？",
                    options: [
                        "catx(\"-\", STUDYID, SITEID, SUBJID)",
                        "concat(STUDYID, SITEID, SUBJID)",
                        "paste0(STUDYID, SITEID, SUBJID)",
                        "join(STUDYID, SITEID, SUBJID)"
                    ],
                    answer: 0,
                    explanation: "SASではcatx()関数を使用して区切り文字付きの文字列結合を行います。catx(\"-\", ...)はハイフン区切りでSTUDYID-SITEID-SUBJIDを生成します。concat()はSQL用、paste0()はR言語の関数です。"
                },
                {
                    id: "q301_2",
                    type: "fill",
                    question: "SDTMにおけるStudy Dayの計算式は「date - RFSTDTC + (date >= _____)」です。空欄に入る変数名を入力してください。",
                    answer: "RFSTDTC",
                    explanation: "Study Day（--DY）は参照開始日（RFSTDTC）を基準に計算します。公式は date - RFSTDTC + (date >= RFSTDTC) で、Day 0を飛ばして Day -1 から Day 1 に移行させます。"
                },
                {
                    id: "q301_3",
                    type: "choice",
                    question: "SASでSDTMデータセットの変数の並び順を制御するステートメントはどれですか？",
                    options: [
                        "ORDER",
                        "RETAIN",
                        "KEEP",
                        "FORMAT"
                    ],
                    answer: 1,
                    explanation: "RETAINステートメントをDATA ステップの先頭に記述することで、出力データセットの変数の並び順をSDTM IGの定義に合わせることができます。"
                },
                {
                    id: "q301_4",
                    type: "choice",
                    question: "QCのダブルプログラミングで2つのデータセットを比較するSASプロシジャはどれですか？",
                    options: [
                        "PROC DIFF",
                        "PROC COMPARE",
                        "PROC MATCH",
                        "PROC VERIFY"
                    ],
                    answer: 1,
                    explanation: "PROC COMPAREは2つのデータセットを変数ごとに比較し、差異を詳細にレポートします。SDTMのQCダブルプログラミングで標準的に使用されます。"
                },
                {
                    id: "q301_5",
                    type: "choice",
                    question: "SASでAESEQ（連番）を被験者ごとに生成する正しい方法はどれですか？",
                    options: [
                        "AESEQ = _N_;",
                        "first.USUBJIDでリセットし、AESEQ + 1で加算",
                        "AESEQ = monotonic();",
                        "PROC FREQ で連番を振る"
                    ],
                    answer: 1,
                    explanation: "BY USUBJIDで処理し、first.USUBJIDで0にリセット後に AESEQ + 1 で加算する方法が標準的です。_N_はデータセット全体の連番になり、被験者ごとのリセットができません。"
                },
                {
                    id: "q301_6",
                    type: "fill",
                    question: "SASでControlled Terminologyへのマッピングに使用できる条件分岐ステートメントは SELECT(変数); WHEN(...) ...; END; です。この構文名を英語で入力してください。",
                    answer: "SELECT",
                    explanation: "SASのSELECT-WHENステートメントは、変数の値に応じて異なるCDISC Controlled Terminologyの値を割り当てるのに適しています。IF-THEN-ELSEの連鎖よりも可読性が高くなります。"
                }
            ]
        },

        // =====================================================================
        // Module 17: RによるSDTM作成 (id: 302)
        // =====================================================================
        {
            id: 302,
            title: "RによるSDTM作成",
            duration: "35分",
            content: `
<h2>RによるSDTMデータセット作成</h2>

<h3>1. R環境の準備</h3>
<p>Rでは、<strong>tidyverse</strong>（データ操作）、<strong>admiral</strong>（pharmaverseのSDTM/ADaM用パッケージ）、<strong>haven</strong>（SASデータ読み書き）などのパッケージを使用します。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">R</span></div><pre><code class="language-r">
# パッケージのインストール（初回のみ）
install.packages(c("tidyverse", "haven", "lubridate"))
install.packages("admiral", repos = "https://pharmaverse.r-universe.dev")
install.packages("metacore")      # メタデータ管理
install.packages("xportr")        # XPTファイル出力

# パッケージの読み込み
library(tidyverse)   # dplyr, tidyr, stringr, etc.
library(admiral)     # pharmaverse SDTM/ADaM derivations
library(haven)       # SAS/XPT data I/O
library(lubridate)   # 日付処理
library(xportr)      # XPT output with metadata
</code></pre></div>

<h3>2. データの読み込み</h3>
<p>havenパッケージを使ってSASデータセットやXPTファイルを読み込みます。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">R</span></div><pre><code class="language-r">
# SAS データセットの読み込み
demog_raw &lt;- haven::read_sas("data/raw/demographics.sas7bdat")

# SAS Transport (XPT) ファイルの読み込み
ae_raw &lt;- haven::read_xpt("data/raw/adverse_events.xpt")

# CSVファイルの読み込み
demog_csv &lt;- readr::read_csv("data/raw/demographics.csv")

# データの確認
glimpse(demog_raw)
</code></pre></div>

<h3>3. DMドメインの作成（R / tidyverse）</h3>
<p>tidyverseのdplyrを中心に、DM（Demographics）ドメインを作成します。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">R</span></div><pre><code class="language-r">
#==============================================================
# DM Domain Creation - Demographics (R / tidyverse)
#==============================================================

# 参照日（RFSTDTC, RFENDTC）をEXドメインから取得
ex_raw &lt;- haven::read_sas("data/raw/exposure.sas7bdat")

rf_dates &lt;- ex_raw %&gt;%
  group_by(subjid) %&gt;%
  summarise(
    rfstdtc = min(exstdtc, na.rm = TRUE),
    rfendtc = max(exendtc, na.rm = TRUE),
    .groups = "drop"
  )

# DMドメインの作成
dm &lt;- demog_raw %&gt;%
  left_join(rf_dates, by = "subjid") %&gt;%
  mutate(
    STUDYID = "CDISCPILOT01",
    DOMAIN  = "DM",
    SITEID  = as.character(site),
    USUBJID = paste0(STUDYID, "-", SITEID, "-", subjid),
    SUBJID  = as.character(subjid),

    RFSTDTC  = rfstdtc,
    RFENDTC  = rfendtc,
    RFXSTDTC = rfstdtc,
    RFXENDTC = rfendtc,
    RFICDTC  = format(as.Date(ic_date), "%Y-%m-%d"),

    DTHDTC = if_else(!is.na(death_date),
                     format(as.Date(death_date), "%Y-%m-%d"),
                     NA_character_),
    DTHFL  = if_else(!is.na(death_date), "Y", NA_character_),

    BRTHDTC = format(as.Date(birth_date), "%Y-%m-%d"),
    AGE     = as.numeric(floor(
      interval(as.Date(birth_date), as.Date(ic_date)) / years(1)
    )),
    AGEU = "YEARS",

    # SEX: Controlled Terminologyマッピング
    SEX = case_when(
      toupper(trimws(sex_raw)) %in% c("MALE", "M")   ~ "M",
      toupper(trimws(sex_raw)) %in% c("FEMALE", "F") ~ "F",
      toupper(trimws(sex_raw)) %in% c("UNDIFF", "U") ~ "U",
      TRUE ~ NA_character_
    ),

    # RACE: Controlled Terminologyマッピング
    RACE = case_when(
      toupper(trimws(race_raw)) %in% c("WHITE", "CAUCASIAN")
        ~ "WHITE",
      toupper(trimws(race_raw)) %in% c("BLACK", "AFRICAN AMERICAN",
                                         "BLACK OR AFRICAN AMERICAN")
        ~ "BLACK OR AFRICAN AMERICAN",
      toupper(trimws(race_raw)) == "ASIAN" ~ "ASIAN",
      toupper(trimws(race_raw)) %in% c("AMERICAN INDIAN",
                                         "AMERICAN INDIAN OR ALASKA NATIVE")
        ~ "AMERICAN INDIAN OR ALASKA NATIVE",
      toupper(trimws(race_raw)) %in% c("HAWAIIAN", "PACIFIC ISLANDER",
                                         "NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDER")
        ~ "NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDER",
      TRUE ~ "OTHER"
    ),

    # ETHNIC: Controlled Terminologyマッピング
    ETHNIC = case_when(
      toupper(trimws(ethnic_raw)) %in% c("HISPANIC", "HISPANIC OR LATINO")
        ~ "HISPANIC OR LATINO",
      toupper(trimws(ethnic_raw)) %in% c("NOT HISPANIC", "NOT HISPANIC OR LATINO")
        ~ "NOT HISPANIC OR LATINO",
      TRUE ~ "UNKNOWN"
    ),

    # ARM / ACTARM
    ARMCD = case_when(
      toupper(trimws(trt_group)) == "PLACEBO" ~ "PBOGRP",
      toupper(trimws(trt_group)) %in% c("LOW DOSE", "XANOMELINE LOW DOSE") ~ "XANLD",
      toupper(trimws(trt_group)) %in% c("HIGH DOSE", "XANOMELINE HIGH DOSE") ~ "XANHD",
      TRUE ~ NA_character_
    ),
    ARM = case_when(
      ARMCD == "PBOGRP" ~ "Placebo",
      ARMCD == "XANLD"  ~ "Xanomeline Low Dose",
      ARMCD == "XANHD"  ~ "Xanomeline High Dose",
      TRUE ~ NA_character_
    ),
    ACTARMCD = ARMCD,
    ACTARM   = ARM,
    COUNTRY  = "USA",
    DMDTC    = format(as.Date(collection_date), "%Y-%m-%d")
  ) %&gt;%
  mutate(
    DMDY = as.numeric(as.Date(DMDTC) - as.Date(RFSTDTC)) +
           if_else(as.Date(DMDTC) &gt;= as.Date(RFSTDTC), 1L, 0L)
  ) %&gt;%
  select(
    STUDYID, DOMAIN, USUBJID, SUBJID, RFSTDTC, RFENDTC, RFXSTDTC, RFXENDTC,
    RFICDTC, DTHDTC, DTHFL, SITEID, BRTHDTC, AGE, AGEU, SEX, RACE,
    ETHNIC, ARMCD, ARM, ACTARMCD, ACTARM, COUNTRY, DMDTC, DMDY
  )
</code></pre></div>

<h3>4. AEドメインの作成（admiral）</h3>
<p><strong>admiral</strong>はpharmaverseの主要パッケージで、SDTM/ADaMの変数導出を効率化する関数群を提供します。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">R</span></div><pre><code class="language-r">
#==============================================================
# AE Domain Creation - Adverse Events (R / admiral)
#==============================================================

ae_raw    &lt;- haven::read_sas("data/raw/adverse_events.sas7bdat")
meddra    &lt;- haven::read_sas("data/raw/meddra_coding.sas7bdat")
dm_domain &lt;- haven::read_xpt("data/sdtm/dm.xpt")

dm_ref &lt;- dm_domain %&gt;% select(USUBJID, SUBJID, RFSTDTC)

ae &lt;- ae_raw %&gt;%
  left_join(meddra, by = c("subjid", "ae_num")) %&gt;%
  left_join(dm_ref, by = c("subjid" = "SUBJID")) %&gt;%
  mutate(
    STUDYID  = "CDISCPILOT01",
    DOMAIN   = "AE",
    AETERM   = trimws(ae_verbatim),
    AEDECOD  = trimws(meddra_pt),
    AEBODSYS = trimws(meddra_soc),

    AESEV = case_when(
      toupper(severity) == "MILD"     ~ "MILD",
      toupper(severity) == "MODERATE" ~ "MODERATE",
      toupper(severity) == "SEVERE"   ~ "SEVERE",
      TRUE ~ NA_character_
    ),
    AESER = if_else(toupper(serious_flag) %in% c("YES", "Y"), "Y", "N"),
    AEACN = case_when(
      toupper(action_taken) == "NONE"             ~ "DOSE NOT CHANGED",
      toupper(action_taken) == "DOSE REDUCED"     ~ "DOSE REDUCED",
      toupper(action_taken) == "DRUG INTERRUPTED" ~ "DRUG INTERRUPTED",
      toupper(action_taken) == "DRUG WITHDRAWN"   ~ "DRUG WITHDRAWN",
      TRUE ~ NA_character_
    ),
    AEREL = case_when(
      toupper(relationship) %in% c("RELATED", "PROBABLE", "POSSIBLE")
        ~ "POSSIBLY RELATED",
      toupper(relationship) %in% c("NOT RELATED", "NONE", "UNLIKELY")
        ~ "NOT RELATED",
      TRUE ~ NA_character_
    ),
    AEOUT = case_when(
      toupper(outcome) == "RECOVERED"              ~ "RECOVERED/RESOLVED",
      toupper(outcome) == "RECOVERING"             ~ "RECOVERING/RESOLVING",
      toupper(outcome) == "NOT RECOVERED"          ~ "NOT RECOVERED/NOT RESOLVED",
      toupper(outcome) == "FATAL"                  ~ "FATAL",
      toupper(outcome) == "RECOVERED WITH SEQUELAE" ~ "RECOVERED/RESOLVED WITH SEQUELAE",
      TRUE ~ NA_character_
    ),
    AESTDTC = format(as.Date(ae_start_date), "%Y-%m-%d"),
    AEENDTC = if_else(!is.na(ae_end_date),
                      format(as.Date(ae_end_date), "%Y-%m-%d"),
                      NA_character_)
  )

# admiralでStudy Dayを算出
ae &lt;- ae %&gt;%
  derive_vars_dy(reference_date = RFSTDTC,
                 source_vars = exprs(AESTDTC, AEENDTC))

# --SEQ の生成
ae &lt;- ae %&gt;%
  derive_var_obs_number(
    new_var = AESEQ, order = exprs(AESTDTC, AETERM),
    by_vars = exprs(USUBJID), check_type = "none"
  )

ae &lt;- ae %&gt;%
  select(STUDYID, DOMAIN, USUBJID, AESEQ, AETERM, AEDECOD, AEBODSYS,
         AESEV, AESER, AEACN, AEREL, AEOUT, AESTDTC, AEENDTC, AESTDY, AEENDY)
</code></pre></div>

<h3>5. SASとRの比較：USUBJID作成</h3>
<p>同じ処理をSASとRで書くとどのように異なるか、代表的な例を比較してみましょう。</p>

<div class="code-tabs">
    <div class="code-tab-buttons">
        <button class="code-tab-btn active" onclick="App.switchCodeTab(this, 'sas')">SAS</button>
        <button class="code-tab-btn" onclick="App.switchCodeTab(this, 'r')">R</button>
    </div>
    <div class="code-tab-content active" data-lang="sas">
        <div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/* USUBJID の作成 */
USUBJID = catx("-", STUDYID, SITEID, SUBJID);

/* SEX の CTマッピング */
select(upcase(strip(sex_raw)));
    when("MALE", "M")   SEX = "M";
    when("FEMALE", "F") SEX = "F";
    otherwise            SEX = "";
end;

/* Study Day の計算 */
AESTDY = _aestn - _rfstn + (_aestn >= _rfstn);
</code></pre></div>
    </div>
    <div class="code-tab-content" data-lang="r">
        <div class="code-block"><div class="code-block-header"><span class="code-lang">R</span></div><pre><code class="language-r">
# USUBJID の作成
USUBJID = paste0(STUDYID, "-", SITEID, "-", subjid)

# SEX の CTマッピング
SEX = case_when(
  toupper(trimws(sex_raw)) %in% c("MALE", "M") ~ "M",
  toupper(trimws(sex_raw)) %in% c("FEMALE", "F") ~ "F",
  TRUE ~ NA_character_
)

# Study Day の計算（admiral使用）
ae &lt;- derive_vars_dy(ae, reference_date = RFSTDTC,
                     source_vars = exprs(AESTDTC))
</code></pre></div>
    </div>
</div>

<h3>6. SASとRの比較：XPTファイルの出力</h3>

<div class="code-tabs">
    <div class="code-tab-buttons">
        <button class="code-tab-btn active" onclick="App.switchCodeTab(this, 'sas')">SAS</button>
        <button class="code-tab-btn" onclick="App.switchCodeTab(this, 'r')">R</button>
    </div>
    <div class="code-tab-content active" data-lang="sas">
        <div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/* XPTファイルの出力 */
libname xptout xport "C:/study/sdtm/dm.xpt";
proc copy in=sdtm out=xptout;
    select dm;
run;
libname xptout clear;
</code></pre></div>
    </div>
    <div class="code-tab-content" data-lang="r">
        <div class="code-block"><div class="code-block-header"><span class="code-lang">R</span></div><pre><code class="language-r">
# XPTファイルの出力（haven）
haven::write_xpt(dm, path = "data/sdtm/dm.xpt")

# xportr でメタデータ付きの出力
dm %&gt;%
  xportr_type(metacore)    %&gt;%
  xportr_length(metacore)  %&gt;%
  xportr_label(metacore)   %&gt;%
  xportr_order(metacore)   %&gt;%
  xportr_format(metacore)  %&gt;%
  xportr_write("data/sdtm/dm.xpt")
</code></pre></div>
    </div>
</div>

<div class="key-point">
    <div class="key-point-title">SAS vs R のまとめ</div>
    <table class="sdtm-table">
        <thead>
            <tr><th>機能</th><th>SAS</th><th>R</th></tr>
        </thead>
        <tbody>
            <tr><td>データ読み込み</td><td>libname / PROC IMPORT</td><td>haven::read_sas() / read_xpt()</td></tr>
            <tr><td>データ加工</td><td>DATA step</td><td>dplyr (mutate, filter, select)</td></tr>
            <tr><td>条件分岐</td><td>SELECT-WHEN / IF-THEN</td><td>case_when() / if_else()</td></tr>
            <tr><td>文字列結合</td><td>catx() / cats()</td><td>paste0() / str_c()</td></tr>
            <tr><td>Study Day導出</td><td>手動計算</td><td>admiral::derive_vars_dy()</td></tr>
            <tr><td>SEQ生成</td><td>BY + SUM statement</td><td>admiral::derive_var_obs_number()</td></tr>
            <tr><td>XPT出力</td><td>PROC COPY + XPORT engine</td><td>haven::write_xpt() / xportr</td></tr>
            <tr><td>QC比較</td><td>PROC COMPARE</td><td>diffdf / arsenal::compare()</td></tr>
        </tbody>
    </table>
</div>
`,
            quiz: [
                {
                    id: "q302_1",
                    type: "choice",
                    question: "RでSASデータセット（.sas7bdat）を読み込むための関数はどれですか？",
                    options: [
                        "read.sas()",
                        "haven::read_sas()",
                        "foreign::read.sas()",
                        "readr::read_sas()"
                    ],
                    answer: 1,
                    explanation: "havenパッケージのread_sas()関数を使用してSASデータセットを読み込みます。havenはtidyverseの一部で、SAS、SPSS、Stataのデータファイルの読み書きに対応しています。"
                },
                {
                    id: "q302_2",
                    type: "choice",
                    question: "Rのdplyrで条件に基づいて値を割り当てる関数はどれですか？（Controlled Terminologyのマッピングに使用）",
                    options: [
                        "switch()",
                        "if_else()",
                        "case_when()",
                        "recode()"
                    ],
                    answer: 2,
                    explanation: "case_when()は複数の条件分岐を記述でき、SASのSELECT-WHENに相当します。Controlled Terminologyへのマッピングで値を変換するのに最適です。if_else()は2択の場合に使用します。"
                },
                {
                    id: "q302_3",
                    type: "fill",
                    question: "Rでa=\"STUDY\", b=\"01\", c=\"001\"を結合してUSUBJID=\"STUDY-01-001\"を作成する関数は _____(a, \"-\", b, \"-\", c) です。関数名を入力してください。",
                    answer: "paste0",
                    explanation: "paste0()は区切り文字なしで文字列を結合します。paste0(a, \"-\", b, \"-\", c) で \"STUDY-01-001\" が生成されます。paste()はデフォルトでスペース区切りです。"
                },
                {
                    id: "q302_4",
                    type: "choice",
                    question: "admiralパッケージでStudy Day（--DY）変数を導出する関数はどれですか？",
                    options: [
                        "derive_study_day()",
                        "derive_vars_dy()",
                        "compute_dy()",
                        "calc_study_day()"
                    ],
                    answer: 1,
                    explanation: "admiral::derive_vars_dy()は参照日（RFSTDTC等）と対象日付変数から自動的に--DY変数を算出します。Day 0を飛ばすルールも内蔵されています。"
                },
                {
                    id: "q302_5",
                    type: "choice",
                    question: "RからXPT（SAS Transport）ファイルを出力するための関数はどれですか？",
                    options: [
                        "write.csv()",
                        "haven::write_xpt()",
                        "foreign::write.xpt()",
                        "readr::write_xpt()"
                    ],
                    answer: 1,
                    explanation: "haven::write_xpt()でSAS Transport V5形式のXPTファイルを出力できます。FDAへの提出にはXPT V5形式が求められます。"
                },
                {
                    id: "q302_6",
                    type: "choice",
                    question: "pharmaverseのadmiralパッケージで--SEQ変数を生成する関数はどれですか？",
                    options: [
                        "derive_seq()",
                        "derive_var_obs_number()",
                        "add_sequence()",
                        "generate_seq()"
                    ],
                    answer: 1,
                    explanation: "admiral::derive_var_obs_number()は、by_varsで指定したグループ（通常USUBJID）内で、orderで指定した順序に従って連番を生成します。"
                }
            ]
        },

        // =====================================================================
        // Module 18: マッピング実践 (id: 303)
        // =====================================================================
        {
            id: 303,
            title: "マッピング実践",
            duration: "30分",
            content: `
<h2>SDTMマッピング実践</h2>

<h3>1. マッピングとは？</h3>
<p><strong>マッピング</strong>とは、CRF（症例報告書）やEDCシステムから収集された生データ（Raw Data）を、CDISCのSDTM標準に準拠したデータセットに変換するプロセスです。マッピング仕様書に基づいて、ソースデータの各変数をSDTM変数に対応させます。</p>

<div class="key-point">
    <div class="key-point-title">マッピングの概念</div>
    <p><strong>Raw/CRF Data</strong> (収集されたままの生データ) &rarr; <strong>変換ルール</strong> (マッピング仕様書) &rarr; <strong>SDTMデータセット</strong> (標準化されたデータ)</p>
</div>

<h3>2. マッピング仕様書の読み方</h3>
<p>マッピング仕様書（Mapping Specification）は、各SDTM変数のソース、変換ロジック、使用するControlled Terminologyを詳細に記述した文書です。</p>

<table class="sdtm-table">
    <thead>
        <tr><th>SDTM Variable</th><th>Source Dataset</th><th>Source Variable</th><th>Mapping Logic</th><th>CT / Codelist</th></tr>
    </thead>
    <tbody>
        <tr><td>STUDYID</td><td>-</td><td>-</td><td>定数 "CDISCPILOT01"</td><td>-</td></tr>
        <tr><td>DOMAIN</td><td>-</td><td>-</td><td>定数 "VS"</td><td>-</td></tr>
        <tr><td>USUBJID</td><td>DM</td><td>USUBJID</td><td>DMドメインから取得</td><td>-</td></tr>
        <tr><td>VSSEQ</td><td>-</td><td>-</td><td>USUBJID内の連番</td><td>-</td></tr>
        <tr><td>VSTESTCD</td><td>CRF_VS</td><td>test_code</td><td>CTマッピング</td><td>VSTESTCD</td></tr>
        <tr><td>VSTEST</td><td>CRF_VS</td><td>test_name</td><td>CTマッピング</td><td>VSTEST</td></tr>
        <tr><td>VSORRES</td><td>CRF_VS</td><td>result_value</td><td>直接コピー</td><td>-</td></tr>
        <tr><td>VSORRESU</td><td>CRF_VS</td><td>result_unit</td><td>CTマッピング</td><td>UNIT</td></tr>
        <tr><td>VSSTRESC</td><td>CRF_VS</td><td>result_value</td><td>標準化</td><td>-</td></tr>
        <tr><td>VSSTRESN</td><td>-</td><td>-</td><td>VSSTRESCの数値変換</td><td>-</td></tr>
        <tr><td>VSSTRESU</td><td>CRF_VS</td><td>result_unit</td><td>標準単位にマッピング</td><td>UNIT</td></tr>
        <tr><td>VSDTC</td><td>CRF_VS</td><td>assessment_date</td><td>ISO 8601形式</td><td>-</td></tr>
        <tr><td>VSDY</td><td>-</td><td>-</td><td>VSDTC - RFSTDTC + (VSDTC&gt;=RFSTDTC)</td><td>-</td></tr>
    </tbody>
</table>

<h3>3. マッピングプロセスのステップ</h3>
<ol>
    <li><strong>仕様書の確認</strong>: マッピング仕様書、SDTM IG、Controlled Terminologyを確認</li>
    <li><strong>ソースデータの特定</strong>: どの生データテーブル/変数を使用するか確認</li>
    <li><strong>変換ルールの適用</strong>: 仕様書に基づいてプログラミング</li>
    <li><strong>Controlled Terminologyの割り当て</strong>: CDISC CTに準拠した値にマッピング</li>
    <li><strong>時間変数の導出</strong>: --DTC（ISO 8601日付）と--DY（Study Day）を算出</li>
    <li><strong>--SEQの作成</strong>: ドメイン固有の連番を生成</li>
    <li><strong>変数属性の設定</strong>: ラベル、長さ、データ型を設定</li>
    <li><strong>ソートと出力</strong>: SDTM IGに従った順序でソート、XPTファイルを出力</li>
</ol>

<h3>4. 実践例：VS（Vital Signs）ドメインの完全マッピング</h3>

<h4>4.1 CRF生データの例</h4>
<p>以下のような横型（Wide format）の生データがCRFから収集されたとします。</p>

<table class="sdtm-table">
    <thead>
        <tr><th>subjid</th><th>visit</th><th>visit_date</th><th>sysbp</th><th>diabp</th><th>pulse</th><th>temp</th><th>height</th><th>weight</th></tr>
    </thead>
    <tbody>
        <tr><td>001</td><td>SCREENING</td><td>2023-01-10</td><td>120</td><td>80</td><td>72</td><td>36.5</td><td>170</td><td>65</td></tr>
        <tr><td>001</td><td>WEEK 1</td><td>2023-01-20</td><td>118</td><td>78</td><td>70</td><td>36.4</td><td></td><td>65</td></tr>
        <tr><td>001</td><td>WEEK 4</td><td>2023-02-17</td><td>122</td><td>82</td><td>74</td><td>36.6</td><td></td><td>64</td></tr>
    </tbody>
</table>

<h4>4.2 SDTMターゲット構造（縦型 / Long format）</h4>
<p>VSドメインでは各テスト項目が1行となる<strong>縦型（Long format）</strong>に変換します。</p>

<table class="sdtm-table">
    <thead>
        <tr><th>USUBJID</th><th>VSTESTCD</th><th>VSTEST</th><th>VSORRES</th><th>VSORRESU</th><th>VSSTRESN</th><th>VSSTRESU</th><th>VISITNUM</th><th>VISIT</th><th>VSDTC</th></tr>
    </thead>
    <tbody>
        <tr><td>CDISC01-01-001</td><td>SYSBP</td><td>Systolic Blood Pressure</td><td>120</td><td>mmHg</td><td>120</td><td>mmHg</td><td>1</td><td>SCREENING</td><td>2023-01-10</td></tr>
        <tr><td>CDISC01-01-001</td><td>DIABP</td><td>Diastolic Blood Pressure</td><td>80</td><td>mmHg</td><td>80</td><td>mmHg</td><td>1</td><td>SCREENING</td><td>2023-01-10</td></tr>
        <tr><td>CDISC01-01-001</td><td>PULSE</td><td>Pulse Rate</td><td>72</td><td>beats/min</td><td>72</td><td>beats/min</td><td>1</td><td>SCREENING</td><td>2023-01-10</td></tr>
    </tbody>
</table>

<h4>4.3 SASとRによるVSドメインの完全マッピング</h4>

<div class="code-tabs">
    <div class="code-tab-buttons">
        <button class="code-tab-btn active" onclick="App.switchCodeTab(this, 'sas')">SAS</button>
        <button class="code-tab-btn" onclick="App.switchCodeTab(this, 'r')">R</button>
    </div>
    <div class="code-tab-content active" data-lang="sas">
        <div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/*=============================================================*/
/* VS Domain - Vital Signs (Complete Mapping Example)           */
/*=============================================================*/
%let DOMAIN = VS;

data vs_long;
    set vs_raw;
    length VSTESTCD $8 VSTEST $40 VSORRES $200 VSORRESU $40;

    array vals{6}   sysbp diabp pulse temp height weight;
    array tcd{6} $  ("SYSBP" "DIABP" "PULSE" "TEMP" "HEIGHT" "WEIGHT");
    array tname{6} $ ("Systolic Blood Pressure"
                      "Diastolic Blood Pressure"
                      "Pulse Rate" "Temperature" "Height" "Weight");
    array units{6} $ ("mmHg" "mmHg" "beats/min" "C" "cm" "kg");

    do i = 1 to 6;
        if not missing(vals{i}) then do;
            VSTESTCD = tcd{i};
            VSTEST   = tname{i};
            VSORRES  = strip(put(vals{i}, best.));
            VSORRESU = units{i};
            output;
        end;
    end;
    keep subjid visit visit_date VSTESTCD VSTEST VSORRES VSORRESU;
run;

data vs_mapped;
    merge vs_long(in=a) dm_ref(in=b rename=(SUBJID=subjid));
    by subjid;
    if a and b;

    STUDYID  = "&amp;STUDYID";
    DOMAIN   = "&amp;DOMAIN";
    VSSTRESC = VSORRES;
    VSSTRESN = input(VSORRES, ?? best.);
    VSSTRESU = VSORRESU;

    select(upcase(strip(visit)));
        when("SCREENING") VISITNUM = 1;
        when("WEEK 1")    VISITNUM = 2;
        when("WEEK 4")    VISITNUM = 3;
        when("WEEK 8")    VISITNUM = 4;
        when("WEEK 12")   VISITNUM = 5;
        otherwise         VISITNUM = .;
    end;
    VISIT = upcase(strip(visit));
    VSDTC = put(datepart(visit_date), yymmdd10.);

    if not missing(VSDTC) and not missing(RFSTDTC) then do;
        _vsdtn = input(VSDTC, yymmdd10.);
        _rfstn = input(RFSTDTC, yymmdd10.);
        VSDY = _vsdtn - _rfstn + (_vsdtn >= _rfstn);
    end;
run;

proc sort data=vs_mapped; by USUBJID VISITNUM VSTESTCD; run;
data sdtm.vs(label="Vital Signs");
    set vs_mapped;
    by USUBJID;
    if first.USUBJID then VSSEQ = 0;
    VSSEQ + 1;
run;
</code></pre></div>
    </div>
    <div class="code-tab-content" data-lang="r">
        <div class="code-block"><div class="code-block-header"><span class="code-lang">R</span></div><pre><code class="language-r">
#==============================================================
# VS Domain - Vital Signs (Complete Mapping Example)
#==============================================================

vs_long &lt;- vs_raw %&gt;%
  pivot_longer(
    cols = c(sysbp, diabp, pulse, temp, height, weight),
    names_to = "test_code", values_to = "result_value",
    values_drop_na = TRUE
  ) %&gt;%
  mutate(
    VSTESTCD = case_when(
      test_code == "sysbp" ~ "SYSBP", test_code == "diabp" ~ "DIABP",
      test_code == "pulse" ~ "PULSE", test_code == "temp"  ~ "TEMP",
      test_code == "height" ~ "HEIGHT", test_code == "weight" ~ "WEIGHT"),
    VSTEST = case_when(
      VSTESTCD == "SYSBP" ~ "Systolic Blood Pressure",
      VSTESTCD == "DIABP" ~ "Diastolic Blood Pressure",
      VSTESTCD == "PULSE" ~ "Pulse Rate",
      VSTESTCD == "TEMP"  ~ "Temperature",
      VSTESTCD == "HEIGHT" ~ "Height",
      VSTESTCD == "WEIGHT" ~ "Weight"),
    VSORRESU = case_when(
      VSTESTCD %in% c("SYSBP","DIABP") ~ "mmHg",
      VSTESTCD == "PULSE" ~ "beats/min",
      VSTESTCD == "TEMP" ~ "C",
      VSTESTCD == "HEIGHT" ~ "cm",
      VSTESTCD == "WEIGHT" ~ "kg")
  )

vs &lt;- vs_long %&gt;%
  left_join(dm_ref, by = c("subjid" = "SUBJID")) %&gt;%
  mutate(
    STUDYID = "CDISCPILOT01", DOMAIN = "VS",
    VSORRES = as.character(result_value),
    VSSTRESC = VSORRES, VSSTRESN = as.numeric(result_value),
    VSSTRESU = VSORRESU,
    VISITNUM = case_when(
      toupper(visit) == "SCREENING" ~ 1, toupper(visit) == "WEEK 1" ~ 2,
      toupper(visit) == "WEEK 4" ~ 3, toupper(visit) == "WEEK 8" ~ 4,
      toupper(visit) == "WEEK 12" ~ 5, TRUE ~ NA_real_),
    VISIT = toupper(trimws(visit)),
    VSDTC = format(as.Date(visit_date), "%Y-%m-%d")
  ) %&gt;%
  derive_vars_dy(reference_date = RFSTDTC, source_vars = exprs(VSDTC)) %&gt;%
  derive_var_obs_number(new_var = VSSEQ, order = exprs(VISITNUM, VSTESTCD),
                        by_vars = exprs(USUBJID), check_type = "none") %&gt;%
  select(STUDYID, DOMAIN, USUBJID, VSSEQ, VSTESTCD, VSTEST,
         VSORRES, VSORRESU, VSSTRESC, VSSTRESN, VSSTRESU,
         VISITNUM, VISIT, VSDTC, VSDY)
</code></pre></div>
    </div>
</div>

<h3>5. 一般的なマッピングパターン</h3>

<table class="sdtm-table">
    <thead>
        <tr><th>パターン</th><th>説明</th><th>例</th></tr>
    </thead>
    <tbody>
        <tr><td><strong>One-to-one（直接コピー）</strong></td><td>ソース変数をそのまま対象変数にコピー</td><td>AETERM = ae_verbatim</td></tr>
        <tr><td><strong>Lookup / Decode（CT変換）</strong></td><td>Controlled Terminologyの値に変換</td><td>"Male" &rarr; "M" (SEX)</td></tr>
        <tr><td><strong>Derivation（導出）</strong></td><td>計算式で値を導出</td><td>AGE = 同意日 - 生年月日</td></tr>
        <tr><td><strong>Split / Combine（分割・結合）</strong></td><td>変数を分割または結合</td><td>USUBJID = STUDYID + SITEID + SUBJID</td></tr>
        <tr><td><strong>Vertical Transpose（縦型変換）</strong></td><td>横型→縦型に変換</td><td>VS: 列ごとの検査値 → 行ごとの検査値</td></tr>
    </tbody>
</table>

<h3>6. 部分日付の補完（Date Imputation）</h3>
<p>CRFでは完全な日付が収集されないケースがあります。SDTMでは部分的な日付をISO 8601の精度通りに格納します。</p>

<div class="code-tabs">
    <div class="code-tab-buttons">
        <button class="code-tab-btn active" onclick="App.switchCodeTab(this, 'sas')">SAS</button>
        <button class="code-tab-btn" onclick="App.switchCodeTab(this, 'r')">R</button>
    </div>
    <div class="code-tab-content active" data-lang="sas">
        <div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/* 部分日付の処理 */
data dates;
    set raw.dates;
    length dtc $19;
    if not missing(year) and not missing(month) and not missing(day) then
        dtc = put(mdy(month, day, year), yymmdd10.);
    else if not missing(year) and not missing(month) then
        dtc = catx("-", put(year, z4.), put(month, z2.));
    else if not missing(year) then
        dtc = put(year, z4.);
    else dtc = "";
run;
/* 結果例: 2023-03-15 / 2023-03 / 2023 */
</code></pre></div>
    </div>
    <div class="code-tab-content" data-lang="r">
        <div class="code-block"><div class="code-block-header"><span class="code-lang">R</span></div><pre><code class="language-r">
# 部分日付の処理
dates &lt;- raw_dates %&gt;%
  mutate(dtc = case_when(
    !is.na(year) &amp; !is.na(month) &amp; !is.na(day) ~
      sprintf("%04d-%02d-%02d", year, month, day),
    !is.na(year) &amp; !is.na(month) ~
      sprintf("%04d-%02d", year, month),
    !is.na(year) ~ sprintf("%04d", year),
    TRUE ~ NA_character_
  ))
</code></pre></div>
    </div>
</div>

<h3>7. 文字型から数値型への変換</h3>
<p>検査結果など、CRFでは文字型で収集されるデータを、SDTMでは数値型（--STRESN）に変換する必要があります。</p>

<div class="code-tabs">
    <div class="code-tab-buttons">
        <button class="code-tab-btn active" onclick="App.switchCodeTab(this, 'sas')">SAS</button>
        <button class="code-tab-btn" onclick="App.switchCodeTab(this, 'r')">R</button>
    </div>
    <div class="code-tab-content active" data-lang="sas">
        <div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/* 文字型→数値型の変換 */
VSSTRESN = input(VSORRES, ?? best.);

/* 不等号付きの値の処理 */
if index(VSORRES, "&lt;") &gt; 0 then do;
    VSSTRESC = VSORRES;
    VSSTRESN = input(compress(VSORRES, "&lt;&gt;= "), ?? best.);
end;
</code></pre></div>
    </div>
    <div class="code-tab-content" data-lang="r">
        <div class="code-block"><div class="code-block-header"><span class="code-lang">R</span></div><pre><code class="language-r">
# 文字型→数値型の変換
vs &lt;- vs %&gt;%
  mutate(
    VSSTRESN = case_when(
      str_detect(VSORRES, "[&lt;&gt;]") ~
        as.numeric(str_remove_all(VSORRES, "[&lt;&gt;=\\\\s]")),
      TRUE ~ as.numeric(VSORRES)
    )
  )
</code></pre></div>
    </div>
</div>

<div class="key-point">
    <div class="key-point-title">マッピング実践のまとめ</div>
    <ul>
        <li><strong>マッピング仕様書</strong>を正確に読み、各変数のソースと変換ルールを理解する</li>
        <li><strong>縦型変換</strong>（Transpose）はVS, LBなどのFindings系ドメインで必須</li>
        <li><strong>Controlled Terminology</strong>への変換は正確に行い、許可された値のみ使用する</li>
        <li><strong>部分日付</strong>はISO 8601の精度に合わせて格納する（補完はADaMで行う）</li>
        <li><strong>--SEQ</strong>は必ず被験者内で一意な連番とする</li>
    </ul>
</div>
`,
            quiz: [
                {
                    id: "q303_1",
                    type: "choice",
                    question: "CRFの横型データ（Wide format）をSDTMの縦型データ（Long format）に変換するプロセスを何と呼びますか？",
                    options: [
                        "Normalize",
                        "Transpose / Pivot",
                        "Aggregate",
                        "Merge"
                    ],
                    answer: 1,
                    explanation: "横型（Wide format）から縦型（Long format）への変換はTranspose（転置）またはPivotと呼ばれます。SASではARRAY+DO ループ、Rではpivot_longer()を使用します。"
                },
                {
                    id: "q303_2",
                    type: "choice",
                    question: "マッピング仕様書で「CTマッピング」と記載されている場合、何を行う必要がありますか？",
                    options: [
                        "データをCSV形式に変換する",
                        "CDISC Controlled Terminologyの許可された値に変換する",
                        "Clinical Trial略称に変換する",
                        "CT（Computer Tomography）スキャンデータを取り込む"
                    ],
                    answer: 1,
                    explanation: "CTマッピングとは、CRFの収集値をCDISC Controlled Terminology（標準化された用語集）の許可された値に変換するプロセスです。例：「Male」→「M」（SEXコードリスト）"
                },
                {
                    id: "q303_3",
                    type: "fill",
                    question: "SDTMで部分日付「2023年3月（日不明）」をISO 8601形式で表すと「_____」になります。",
                    answer: "2023-03",
                    explanation: "ISO 8601では、日が不明な場合は精度に合わせてYYYY-MM形式で表現します。SDTMでは部分日付をそのまま格納し、補完（Imputation）はADaMレベルで行います。"
                },
                {
                    id: "q303_4",
                    type: "choice",
                    question: "SDTMマッピングで「直接コピー（One-to-one mapping）」に該当するのはどれですか？",
                    options: [
                        "AETERM = ae_verbatim（CRF記載そのまま）",
                        "SEX = 'M'（Male→M変換）",
                        "AGE = 同意日 - 生年月日（計算）",
                        "USUBJID = STUDYID + SITEID + SUBJID（結合）"
                    ],
                    answer: 0,
                    explanation: "直接コピー（One-to-one mapping）は、ソース変数の値をそのまま対象変数にコピーするパターンです。AETERMはCRFに記載された有害事象のVerbatim（原文）をそのままコピーします。"
                },
                {
                    id: "q303_5",
                    type: "choice",
                    question: "VSドメインのマッピングで、CRFの横型データを縦型に変換する際、SASで使用する手法はどれですか？",
                    options: [
                        "PROC TRANSPOSE",
                        "ARRAY + DOループ",
                        "PROC SORT",
                        "PROC MEANS"
                    ],
                    answer: 1,
                    explanation: "ARRAY文で測定値の配列を定義し、DOループで各テスト項目を行として出力する方法が一般的です。テスト名や単位の付与にはARRAY+DOの方が柔軟です。"
                },
                {
                    id: "q303_6",
                    type: "choice",
                    question: "SDTMで部分日付の補完（Date Imputation）は通常どのレベルで行いますか？",
                    options: [
                        "SDTMレベル",
                        "ADaMレベル",
                        "CRFレベル",
                        "TLFレベル"
                    ],
                    answer: 1,
                    explanation: "SDTMでは部分日付をISO 8601の精度通りにそのまま格納します。日付の補完（Imputation）は分析の目的に応じてADaMレベルで行います。"
                }
            ]
        },

        // =====================================================================
        // Module 19: バリデーション (id: 304)
        // =====================================================================
        {
            id: 304,
            title: "バリデーション",
            duration: "25分",
            content: `
<h2>SDTMバリデーション</h2>

<h3>1. SDTMバリデーションとは？</h3>
<p><strong>SDTMバリデーション</strong>とは、作成したSDTMデータセットがCDISC標準に準拠しているかを検証するプロセスです。FDA/PMDAへの電子申請（eCTD）前に必須であり、データの品質と整合性を確保します。</p>

<div class="key-point">
    <div class="key-point-title">バリデーションの目的</div>
    <ul>
        <li><strong>コンプライアンス</strong>: SDTM Implementation Guide（IG）に準拠しているか確認</li>
        <li><strong>データ品質</strong>: 不整合やエラーの検出・修正</li>
        <li><strong>規制要件</strong>: FDA/PMDAの電子申請要件を満たすか確認</li>
        <li><strong>一貫性</strong>: ドメイン間のデータ整合性を検証</li>
    </ul>
</div>

<h3>2. Pinnacle 21 Community（旧OpenCDISC）</h3>
<p><strong>Pinnacle 21 Community</strong>は、CDISCデータセットのバリデーションツールとして最も広く使用されているソフトウェアです。FDAも推奨しており、業界標準のツールです。</p>

<h4>2.1 セットアップ概要</h4>
<ol>
    <li>Pinnacle 21のウェブサイトからCommunity版をダウンロード（無料）</li>
    <li>Java Runtime Environment（JRE）のインストール（必須）</li>
    <li>Pinnacle 21 Communityのインストール</li>
    <li>最新のCDISC Controlled Terminology（CT）パッケージをダウンロード</li>
    <li>Config設定でSDTM IG バージョン、CT バージョンを指定</li>
</ol>

<h4>2.2 バリデーションの実行</h4>
<ol>
    <li><strong>データの準備</strong>: SDTMデータセットをXPT形式で配置</li>
    <li><strong>Define.xmlの準備</strong>: データ定義ファイル（メタデータ）</li>
    <li><strong>設定</strong>: Standard: SDTM, Version: SDTM IGバージョン, CT Version</li>
    <li><strong>実行</strong>: Validateボタンでバリデーション開始</li>
    <li><strong>結果確認</strong>: Excelレポートが生成される</li>
</ol>

<h4>2.3 バリデーションレポートの読み方</h4>

<table class="sdtm-table">
    <thead>
        <tr><th>カテゴリ</th><th>重要度</th><th>説明</th><th>対応</th></tr>
    </thead>
    <tbody>
        <tr>
            <td style="color: #e74c3c; font-weight: bold;">Error</td>
            <td>高</td>
            <td>CDISC標準への重大な違反。データ構造やルールの破損。</td>
            <td>原則として全件修正が必要</td>
        </tr>
        <tr>
            <td style="color: #f39c12; font-weight: bold;">Warning</td>
            <td>中</td>
            <td>推奨事項への不適合。データの一貫性の問題。</td>
            <td>可能な限り修正、理由の説明が必要な場合あり</td>
        </tr>
        <tr>
            <td style="color: #3498db; font-weight: bold;">Notice</td>
            <td>低</td>
            <td>情報提供。確認事項。</td>
            <td>確認のみ。Reviewer's Guideで説明する場合あり</td>
        </tr>
    </tbody>
</table>

<h3>3. よくあるバリデーションエラーと修正方法</h3>

<h4>SD0001: Invalid variable name（不正な変数名）</h4>
<p>SDTM IGで定義されていない変数名が使用されている場合に発生します。</p>
<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/* 修正: 変数名をSDTM標準に変更 */
data sdtm.dm;
    set sdtm.dm;
    rename GENDER = SEX;  /* GENDER → SEX に変更 */
run;
</code></pre></div>

<h4>SD0003: Missing required variable（必須変数の欠落）</h4>
<p>ドメインに必須（Required）の変数が含まれていない場合に発生します。</p>
<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/* 修正: AESEQを追加 */
proc sort data=sdtm.ae; by USUBJID AESTDTC AETERM; run;
data sdtm.ae;
    set sdtm.ae;
    by USUBJID;
    if first.USUBJID then AESEQ = 0;
    AESEQ + 1;
run;
</code></pre></div>

<h4>SD0006: Invalid Controlled Terminology value（不正なCT値）</h4>
<p>Controlled Terminologyに定義されていない値が使用されている場合に発生します。</p>
<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/* 修正: CTに定義された値にマッピング */
data sdtm.dm;
    set sdtm.dm;
    if SEX = "Male"   then SEX = "M";
    if SEX = "Female" then SEX = "F";
run;

/* 大文字に統一 */
data sdtm.ae;
    set sdtm.ae;
    AESEV = upcase(AESEV);
run;
</code></pre></div>

<h4>SD0009: Inconsistent variable type（変数型の不整合）</h4>
<p>SDTM IGで定義されたデータ型と実際の変数の型が一致しない場合に発生します。</p>
<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/* 修正: 文字型→数値型に変換 */
data sdtm.dm;
    set sdtm.dm(rename=(AGE=_AGE_char));
    AGE = input(_AGE_char, best.);
    drop _AGE_char;
run;
</code></pre></div>

<h4>SD0036: STUDYID inconsistency（STUDYIDの不整合）</h4>
<p>ドメイン間でSTUDYIDの値が一致しない場合に発生します。</p>
<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/* 修正: 全ドメインで統一のSTUDYIDを設定 */
%macro fix_studyid(domain=);
    data sdtm.&amp;domain;
        set sdtm.&amp;domain;
        STUDYID = "&amp;STUDYID";
    run;
%mend;
</code></pre></div>

<h4>SD1001: Missing DM domain / SD1002: Missing USUBJID</h4>
<p>DMドメインは全てのSDTM提出に必須です。USUBJIDは全ドメインの全レコードに必須です。</p>

<h3>4. P21ルールのカテゴリと対応戦略</h3>

<table class="sdtm-table">
    <thead>
        <tr><th>ルールカテゴリ</th><th>チェック内容</th><th>対応戦略</th></tr>
    </thead>
    <tbody>
        <tr><td><strong>構造チェック</strong></td><td>変数名、型、ラベル、長さがIGに準拠しているか</td><td>PROC DATASETSでattribを確認・修正</td></tr>
        <tr><td><strong>CTチェック</strong></td><td>Controlled Terminologyに定義された値が使用されているか</td><td>CT辞書を参照し値を修正</td></tr>
        <tr><td><strong>整合性チェック</strong></td><td>ドメイン間のデータ整合性（USUBJID, STUDYID等）</td><td>DMの値を基準にクロスチェック</td></tr>
        <tr><td><strong>ビジネスルール</strong></td><td>論理的な整合性（例: 開始日 &lt;= 終了日）</td><td>データロジックの見直し</td></tr>
        <tr><td><strong>FDA固有ルール</strong></td><td>FDA提出要件に特化したルール</td><td>FDA Technical Conformance Guide参照</td></tr>
    </tbody>
</table>

<h3>5. QCプロセス：ダブルプログラミング</h3>
<p>SDTMの品質管理ではダブルプログラミングが標準的な手法です。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">
/* 全SDTMドメインの自動比較マクロ */
%macro qc_compare(domain=);
    proc sort data=sdtm.&amp;domain out=_primary; by USUBJID; run;
    proc sort data=qc.&amp;domain   out=_qc;      by USUBJID; run;

    proc compare base=_primary compare=_qc
        listall maxprint=(50,500) criterion=0.00001;
        id USUBJID;
        title "QC Comparison: &amp;domain Domain";
    run;

    %if &amp;sysinfo ne 0 %then
        %put WARNING: &amp;domain - Differences found.;
    %else
        %put NOTE: &amp;domain - QC PASSED.;
%mend qc_compare;

%qc_compare(domain=DM);
%qc_compare(domain=AE);
%qc_compare(domain=VS);
</code></pre></div>

<h3>6. 内部バリデーションチェックリスト</h3>

<table class="sdtm-table">
    <thead>
        <tr><th>#</th><th>チェック項目</th><th>確認方法</th></tr>
    </thead>
    <tbody>
        <tr><td>1</td><td>全ドメインにSTUDYID, DOMAIN, USUBJIDが存在するか</td><td>PROC CONTENTS</td></tr>
        <tr><td>2</td><td>USUBJIDはDMの全被験者を含むか</td><td>PROC SQL</td></tr>
        <tr><td>3</td><td>--SEQ変数がUSUBJID内で一意かつ連続か</td><td>PROC FREQ / PROC SQL</td></tr>
        <tr><td>4</td><td>日付がISO 8601形式（YYYY-MM-DD）か</td><td>正規表現チェック</td></tr>
        <tr><td>5</td><td>Controlled Terminology値が正しいか</td><td>CT辞書とのクロスチェック</td></tr>
        <tr><td>6</td><td>変数のラベルがSDTM IGと一致するか</td><td>PROC CONTENTS + 仕様書比較</td></tr>
        <tr><td>7</td><td>変数の長さが$200以下か（文字型）</td><td>PROC CONTENTS</td></tr>
        <tr><td>8</td><td>データセットのソート順がIG準拠か</td><td>PROC SORT validate</td></tr>
        <tr><td>9</td><td>欠損値のパターンが妥当か</td><td>PROC FREQ / PROC MEANS</td></tr>
        <tr><td>10</td><td>ダブルプログラミングの結果が一致するか</td><td>PROC COMPARE</td></tr>
    </tbody>
</table>

<h3>7. FDA提出前チェックリスト</h3>

<div class="key-point">
    <div class="key-point-title">提出前チェックリスト</div>
    <ul>
        <li><strong>Pinnacle 21バリデーション</strong>: 全Errorが解消、Warningへの対応完了</li>
        <li><strong>Define.xml</strong>: 全データセット・変数のメタデータが正確</li>
        <li><strong>Reviewer's Guide（SDRG）</strong>: バリデーション結果の未解消項目の説明</li>
        <li><strong>XPTファイル</strong>: SAS Transport V5形式、ファイルサイズ5GB以下</li>
        <li><strong>ファイル命名規則</strong>: ドメイン名を小文字で使用（dm.xpt, ae.xpt等）</li>
        <li><strong>フォルダ構造</strong>: eCTDのModule 5構造に準拠</li>
        <li><strong>Controlled Terminology</strong>: 使用CTバージョンの明記</li>
        <li><strong>SDTM IGバージョン</strong>: 使用IGバージョンの明記</li>
        <li><strong>aCRF（Annotated CRF）</strong>: CRFの各項目にSDTM変数名を注記</li>
    </ul>
</div>

<div class="key-point">
    <div class="key-point-title">バリデーションのまとめ</div>
    <ul>
        <li><strong>Pinnacle 21 Community</strong>は業界標準のバリデーションツール</li>
        <li>エラーは<strong>Error（必須修正）</strong>、<strong>Warning（推奨修正）</strong>、<strong>Notice（確認）</strong>の3段階</li>
        <li>よくあるエラー: 不正な変数名、必須変数の欠落、不正なCT値、変数型の不整合</li>
        <li><strong>ダブルプログラミング</strong>とPROC COMPAREによるQCが品質保証の基本</li>
        <li>FDA提出前には包括的なチェックリストで最終確認を行う</li>
    </ul>
</div>
`,
            quiz: [
                {
                    id: "q304_1",
                    type: "choice",
                    question: "SDTMバリデーションで最も広く使用されているツールはどれですか？",
                    options: [
                        "SAS Enterprise Guide",
                        "Pinnacle 21 Community",
                        "R Shiny Validator",
                        "CDISC Validator Pro"
                    ],
                    answer: 1,
                    explanation: "Pinnacle 21 Community（旧OpenCDISC）はCDISCデータのバリデーションに最も広く使用されている業界標準ツールです。FDAも推奨しており、無料で利用できます。"
                },
                {
                    id: "q304_2",
                    type: "choice",
                    question: "Pinnacle 21のバリデーション結果で、CDISC標準への重大な違反を示すカテゴリはどれですか？",
                    options: [
                        "Notice",
                        "Warning",
                        "Error",
                        "Critical"
                    ],
                    answer: 2,
                    explanation: "Errorカテゴリは重大な違反を示し、原則として全件修正が必要です。Warningは推奨事項への不適合、Noticeは確認事項です。"
                },
                {
                    id: "q304_3",
                    type: "fill",
                    question: "バリデーションルールSD0006は「Invalid _____ Terminology value」（不正なCT値）を検出します。空欄を入力してください。",
                    answer: "Controlled",
                    explanation: "SD0006はControlled Terminology（CT）に定義されていない値を検出するルールです。SEX、RACE、AESEVなどCTが定義された変数で、許可されていない値が使われた場合に発生します。"
                },
                {
                    id: "q304_4",
                    type: "choice",
                    question: "SDTMのQCで標準的に使用される手法はどれですか？",
                    options: [
                        "目視確認",
                        "ダブルプログラミング",
                        "ユーザーテスト",
                        "統計的サンプリング"
                    ],
                    answer: 1,
                    explanation: "ダブルプログラミングは、2名のプログラマーが独立に同じデータセットを作成し、PROC COMPAREで結果を比較する手法です。SDTMのQCにおいて最も信頼性の高い方法です。"
                },
                {
                    id: "q304_5",
                    type: "choice",
                    question: "FDA への電子申請（eCTD）で、SDTMデータセットに必須のファイル形式はどれですか？",
                    options: [
                        "SAS Dataset (.sas7bdat)",
                        "CSV (.csv)",
                        "SAS Transport V5 (.xpt)",
                        "JSON (.json)"
                    ],
                    answer: 2,
                    explanation: "FDAへの電子申請にはSAS Transport Version 5形式（XPT）が求められます。ファイルサイズの上限は5GBで、ファイル名はドメイン名の小文字（dm.xpt, ae.xpt等）を使用します。"
                },
                {
                    id: "q304_6",
                    type: "choice",
                    question: "バリデーション結果のWarningやNoticeの未解消項目を説明するために作成する文書はどれですか？",
                    options: [
                        "SAP (Statistical Analysis Plan)",
                        "Reviewer's Guide (SDRG)",
                        "Protocol",
                        "Define.xml"
                    ],
                    answer: 1,
                    explanation: "SDRG（Study Data Reviewer's Guide）は、バリデーション結果で未解消のWarning/Noticeについて、その理由や背景をFDAレビュアーに説明するための文書です。"
                }
            ]
        },

        // =====================================================================
        // Module 20: PythonによるSDTM作成 (id: 305)
        // =====================================================================
        {
            id: 305,
            title: "PythonによるSDTM作成",
            duration: "35分",
            content: `
<h2>PythonによるSDTMデータセット作成</h2>

<h3>1. なぜPythonでSDTMを作成するのか</h3>
<p>近年、製薬業界においてPythonの採用が急速に進んでいます。従来はSASが圧倒的なシェアを占めていましたが、以下の理由からPythonへの移行が加速しています。</p>

<ul>
    <li><strong>オープンソース</strong>：ライセンス費用が不要で、誰でも利用可能</li>
    <li><strong>データサイエンスとの統合</strong>：機械学習、AI、統計解析のエコシステムと直接連携</li>
    <li><strong>豊富なライブラリ</strong>：pandas、NumPy、pyreadstatなど強力なデータ操作ツール</li>
    <li><strong>規制当局の受け入れ</strong>：FDAがオープンソースツールの使用を認める方向へ</li>
    <li><strong>人材確保</strong>：Python人材はSASプログラマーより豊富で採用が容易</li>
</ul>

<div class="info-box tip">
<div class="info-box-title">💡 業界動向</div>
PHUSE（Pharmaceutical Users Software Exchange）やCDISC Open Sourceイニシアチブにより、PythonでのSDTM作成ツールやフレームワークの開発が活発に進んでいます。SASからPythonへの完全移行はまだ途上ですが、ハイブリッド環境での併用は既に一般的です。
</div>

<h3>2. 必要なライブラリと環境構築</h3>
<p>PythonでSDTMデータセットを作成するために必要な主要ライブラリは以下の通りです。</p>

<table class="sdtm-table">
    <thead>
        <tr><th>ライブラリ</th><th>用途</th><th>備考</th></tr>
    </thead>
    <tbody>
        <tr><td><strong>pandas</strong></td><td>データフレーム操作、変数導出</td><td>データ操作の中核</td></tr>
        <tr><td><strong>pyreadstat</strong></td><td>SASデータ・XPTファイルの読み書き</td><td>XPT V5出力に対応</td></tr>
        <tr><td><strong>datetime</strong></td><td>日付・時刻処理</td><td>標準ライブラリ</td></tr>
        <tr><td><strong>numpy</strong></td><td>数値演算、欠損値処理</td><td>NaN処理に必須</td></tr>
        <tr><td><strong>os / pathlib</strong></td><td>ファイルパス操作</td><td>標準ライブラリ</td></tr>
    </tbody>
</table>

<div class="code-block"><div class="code-block-header"><span class="code-lang">Python</span></div><pre><code class="language-python">
# 環境構築: 必要なライブラリのインストール
# pip install pandas pyreadstat numpy openpyxl

import pandas as pd
import pyreadstat
import numpy as np
from datetime import datetime
from pathlib import Path

# プロジェクトパスの設定
RAW_DIR = Path("C:/study/CDISCPILOT01/raw")
SDTM_DIR = Path("C:/study/CDISCPILOT01/sdtm")
SDTM_DIR.mkdir(parents=True, exist_ok=True)

# 定数の定義
STUDYID = "CDISCPILOT01"
</code></pre></div>

<h3>3. 生データの読み込み</h3>
<p>pandasとpyreadstatを使用して、CSV、Excel、SASデータセットなど様々な形式のデータを読み込めます。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">Python</span></div><pre><code class="language-python">
# === CSVファイルの読み込み ===
demog_csv = pd.read_csv(RAW_DIR / "demographics.csv", encoding="utf-8")

# === Excelファイルの読み込み ===
demog_xlsx = pd.read_excel(RAW_DIR / "demographics.xlsx", sheet_name="Sheet1")

# === SASデータセットの読み込み（.sas7bdat） ===
demog_sas, meta = pyreadstat.read_sas7bdat(RAW_DIR / "demographics.sas7bdat")

# === XPTファイルの読み込み ===
demog_xpt, meta_xpt = pyreadstat.read_xport(RAW_DIR / "demographics.xpt")

# データの確認
print(demog_csv.shape)
print(demog_csv.dtypes)
print(demog_csv.head())
</code></pre></div>

<h3>4. DMドメインの作成（完全例）</h3>
<p>DM（Demographics）ドメインをpandasで作成する完全な手順を示します。生データの読み込みから変数導出、Controlled Terminologyマッピング、XPT出力までの全工程を解説します。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">Python</span></div><pre><code class="language-python">
import pandas as pd
import pyreadstat
import numpy as np
from datetime import datetime

STUDYID = "CDISCPILOT01"
DOMAIN = "DM"

# =====================================================
# Step 1: 生データの読み込み
# =====================================================
raw_demog = pd.read_csv("C:/study/CDISCPILOT01/raw/demographics.csv")

# =====================================================
# Step 2: 基本変数の設定
# =====================================================
dm = pd.DataFrame()
dm["STUDYID"] = STUDYID
dm["DOMAIN"] = DOMAIN
dm["USUBJID"] = STUDYID + "-" + raw_demog["SITEID"].astype(str) + "-" + raw_demog["SUBJID"].astype(str)
dm["SUBJID"] = raw_demog["SUBJID"].astype(str)
dm["SITEID"] = raw_demog["SITEID"].astype(str)

# =====================================================
# Step 3: Controlled Terminologyマッピング
# =====================================================
# SEXのマッピング
sex_map = {"Male": "M", "Female": "F", "男性": "M", "女性": "F"}
dm["SEX"] = raw_demog["SEX_RAW"].map(sex_map)

# RACEのマッピング
race_map = {
    "White": "WHITE",
    "Black": "BLACK OR AFRICAN AMERICAN",
    "Asian": "ASIAN",
    "Other": "OTHER"
}
dm["RACE"] = raw_demog["RACE_RAW"].map(race_map)

# ETHNICのマッピング
ethnic_map = {
    "Hispanic": "HISPANIC OR LATINO",
    "Non-Hispanic": "NOT HISPANIC OR LATINO"
}
dm["ETHNIC"] = raw_demog["ETHNIC_RAW"].map(ethnic_map)

# =====================================================
# Step 4: 年齢の算出
# =====================================================
dm["BRTHDTC"] = pd.to_datetime(raw_demog["BIRTHDATE"]).dt.strftime("%Y-%m-%d")
dm["RFSTDTC"] = pd.to_datetime(raw_demog["FIRSTDOSE"]).dt.strftime("%Y-%m-%d")

# AGEの計算（投与開始日時点の年齢）
brthdt = pd.to_datetime(raw_demog["BIRTHDATE"])
rfstdt = pd.to_datetime(raw_demog["FIRSTDOSE"])
dm["AGE"] = ((rfstdt - brthdt).dt.days / 365.25).astype(int)
dm["AGEU"] = "YEARS"

# =====================================================
# Step 5: その他の変数
# =====================================================
dm["ARMCD"] = raw_demog["TREATMENT_CODE"]
dm["ARM"] = raw_demog["TREATMENT_NAME"]
dm["COUNTRY"] = raw_demog["COUNTRY"]
dm["RFENDTC"] = pd.to_datetime(raw_demog["LASTDOSE"]).dt.strftime("%Y-%m-%d")

# =====================================================
# Step 6: 変数の選択と並び順
# =====================================================
dm_vars = [
    "STUDYID", "DOMAIN", "USUBJID", "SUBJID", "RFSTDTC", "RFENDTC",
    "SITEID", "BRTHDTC", "AGE", "AGEU", "SEX", "RACE", "ETHNIC",
    "ARMCD", "ARM", "COUNTRY"
]
dm = dm[dm_vars]

print(f"DM domain: {dm.shape[0]} records, {dm.shape[1]} variables")
print(dm.head())
</code></pre></div>

<h3>5. ISO 8601 日付処理</h3>
<p>SDTMでは全ての日付をISO 8601形式（文字型）で格納します。pandasのdatetime機能を活用して変換します。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">Python</span></div><pre><code class="language-python">
# === ISO 8601形式への変換 ===

# 完全な日付時刻
raw_date = "15MAR2024:10:30:00"
dt = pd.to_datetime(raw_date, format="%d%b%Y:%H:%M:%S")
iso_dtc = dt.strftime("%Y-%m-%dT%H:%M:%S")
# 結果: "2024-03-15T10:30:00"

# 日付のみ
iso_date = dt.strftime("%Y-%m-%d")
# 結果: "2024-03-15"

# DataFrameでの一括変換
dm["RFSTDTC"] = pd.to_datetime(raw_demog["FIRSTDOSE"]).dt.strftime("%Y-%m-%dT%H:%M:%S")

# === Study Day（--DY）の算出 ===
def calc_study_day(dtc, rfstdtc):
    """
    Study Dayを算出する関数
    - Day 0 は存在しない
    - dtc >= rfstdtc の場合: DY = (dtc - rfstdtc).days + 1
    - dtc < rfstdtc の場合:  DY = (dtc - rfstdtc).days
    """
    if pd.isna(dtc) or pd.isna(rfstdtc):
        return np.nan
    diff = (dtc - rfstdtc).days
    return diff + 1 if diff >= 0 else diff

# DataFrameに適用
ae["AESTDY"] = ae.apply(
    lambda row: calc_study_day(
        pd.to_datetime(row["AESTDTC"], errors="coerce"),
        pd.to_datetime(row["RFSTDTC"], errors="coerce")
    ), axis=1
)
</code></pre></div>

<h3>6. AEドメインの作成（概要）</h3>
<p>AE（Adverse Events）ドメインでは、<strong>AESEQ</strong>の生成や<strong>MedDRA</strong>コーディングの統合が重要なポイントです。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">Python</span></div><pre><code class="language-python">
# =====================================================
# AEドメイン: AESEQ生成とMedDRAコーディング
# =====================================================

raw_ae = pd.read_csv(RAW_DIR / "adverse_events.csv")

ae = pd.DataFrame()
ae["STUDYID"] = STUDYID
ae["DOMAIN"] = "AE"
ae["USUBJID"] = STUDYID + "-" + raw_ae["SITEID"].astype(str) + "-" + raw_ae["SUBJID"].astype(str)

# AESEQ: 被験者内の連番を生成
# groupby + cumcount を使用（0始まりなので+1）
ae["AESEQ"] = ae.groupby("USUBJID").cumcount() + 1

ae["AETERM"] = raw_ae["AE_VERBATIM"].str.upper()
ae["AEDECOD"] = raw_ae["AE_PREFERRED_TERM"]  # MedDRA PT

# AESEVのControlled Terminologyマッピング
severity_map = {"Mild": "MILD", "Moderate": "MODERATE", "Severe": "SEVERE"}
ae["AESEV"] = raw_ae["SEVERITY"].map(severity_map)

# 日付のISO 8601変換
ae["AESTDTC"] = pd.to_datetime(raw_ae["AE_START"]).dt.strftime("%Y-%m-%d")
ae["AEENDTC"] = pd.to_datetime(raw_ae["AE_END"]).dt.strftime("%Y-%m-%d")

# MedDRAコーディング統合（外部辞書とマージ）
# meddra = pd.read_csv("meddra_dictionary.csv")
# ae = ae.merge(meddra[["AEDECOD", "AEBODSYS", "AESOC"]], on="AEDECOD", how="left")

print(f"AE domain: {ae.shape[0]} records")
</code></pre></div>

<h3>7. VSドメインの作成（概要）</h3>
<p>VS（Vital Signs）ドメインでは、CRFの横型（Wide format）データを縦型（Vertical/Long format）に変換する処理が重要です。pandasの<strong>pd.melt()</strong>を使用します。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">Python</span></div><pre><code class="language-python">
# =====================================================
# VSドメイン: 横型→縦型変換（pd.melt）
# =====================================================

# CRF生データ（横型）の例
# columns: SUBJID, VISIT, SYSBP, DIABP, PULSE, TEMP, HEIGHT, WEIGHT
raw_vs = pd.read_csv(RAW_DIR / "vitalsigns.csv")

# pd.melt() で縦型に変換
vs_long = pd.melt(
    raw_vs,
    id_vars=["SUBJID", "SITEID", "VISIT", "VISIT_DATE"],
    value_vars=["SYSBP", "DIABP", "PULSE", "TEMP", "HEIGHT", "WEIGHT"],
    var_name="VSTEST_RAW",
    value_name="VSSTRESN"
)

# VSTESTCDとVSTESTのマッピング
test_map = {
    "SYSBP":  {"VSTESTCD": "SYSBP",  "VSTEST": "Systolic Blood Pressure",  "VSORRESU": "mmHg"},
    "DIABP":  {"VSTESTCD": "DIABP",  "VSTEST": "Diastolic Blood Pressure", "VSORRESU": "mmHg"},
    "PULSE":  {"VSTESTCD": "PULSE",  "VSTEST": "Pulse Rate",               "VSORRESU": "BEATS/MIN"},
    "TEMP":   {"VSTESTCD": "TEMP",   "VSTEST": "Temperature",              "VSORRESU": "C"},
    "HEIGHT": {"VSTESTCD": "HEIGHT", "VSTEST": "Height",                   "VSORRESU": "cm"},
    "WEIGHT": {"VSTESTCD": "WEIGHT", "VSTEST": "Weight",                   "VSORRESU": "kg"}
}

test_df = pd.DataFrame.from_dict(test_map, orient="index").reset_index()
test_df.columns = ["VSTEST_RAW", "VSTESTCD", "VSTEST", "VSORRESU"]

vs = vs_long.merge(test_df, on="VSTEST_RAW", how="left")

# 標準単位への変換例（華氏→摂氏）
mask = (vs["VSTESTCD"] == "TEMP") &amp; (vs["VSORRESU"] == "F")
vs.loc[mask, "VSSTRESN"] = (vs.loc[mask, "VSSTRESN"] - 32) * 5 / 9
vs.loc[mask, "VSSTRESU"] = "C"

# VSSEQの生成
vs = vs.sort_values(["USUBJID", "VISITNUM", "VSTESTCD"])
vs["VSSEQ"] = vs.groupby("USUBJID").cumcount() + 1

print(f"VS domain: {vs.shape[0]} records")
</code></pre></div>

<h3>8. XPTファイルへの出力</h3>
<p>最終的なSDTMデータセットをSAS Transport V5形式（XPT）で出力します。pyreadstatの<strong>write_xport()</strong>を使用します。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">Python</span></div><pre><code class="language-python">
# =====================================================
# XPTファイルへの出力
# =====================================================

# 変数ラベルの定義（辞書形式）
dm_labels = {
    "STUDYID": "Study Identifier",
    "DOMAIN":  "Domain Abbreviation",
    "USUBJID": "Unique Subject Identifier",
    "SUBJID":  "Subject Identifier for the Study",
    "RFSTDTC": "Subject Reference Start Date/Time",
    "RFENDTC": "Subject Reference End Date/Time",
    "SITEID":  "Study Site Identifier",
    "BRTHDTC": "Date/Time of Birth",
    "AGE":     "Age",
    "AGEU":    "Age Units",
    "SEX":     "Sex",
    "RACE":    "Race",
    "ETHNIC":  "Ethnicity",
    "ARMCD":   "Planned Arm Code",
    "ARM":     "Description of Planned Arm",
    "COUNTRY": "Country"
}

# 全変数を文字型に変換（XPTの互換性確保）
# 注意: 数値変数はそのまま数値型で出力
dm_out = dm.copy()

# pyreadstatでXPT出力
pyreadstat.write_xport(
    dm_out,
    str(SDTM_DIR / "dm.xpt"),
    table_name="DM",
    column_labels=[dm_labels.get(col, col) for col in dm_out.columns],
    file_label="Demographics"
)

print(f"Output: {SDTM_DIR / 'dm.xpt'}")
</code></pre></div>

<div class="info-box warning">
<div class="info-box-title">⚠️ XPT出力時の注意点</div>
<ul>
    <li>XPT V5は変数名8文字制限があります（SDTMは8文字以内なので通常問題なし）</li>
    <li>文字変数のlength属性は<strong>pyreadstat</strong>が自動設定しますが、200バイト以内を推奨</li>
    <li>変数ラベル（column_labels）は最大40文字です</li>
    <li>データセットラベル（file_label）は最大40文字です</li>
</ul>
</div>

<h3>9. SAS vs R vs Python 比較</h3>
<p>SDTMプログラミングにおける3言語の特徴を比較します。</p>

<table class="sdtm-table">
    <thead>
        <tr><th>機能</th><th>SAS</th><th>R</th><th>Python</th></tr>
    </thead>
    <tbody>
        <tr><td>ライセンス</td><td>商用（高額）</td><td>無料（OSS）</td><td>無料（OSS）</td></tr>
        <tr><td>業界実績</td><td>30年以上</td><td>10年以上</td><td>急速に拡大中</td></tr>
        <tr><td>XPT出力</td><td>PROC COPY/XPORT</td><td>haven::write_xpt()</td><td>pyreadstat.write_xport()</td></tr>
        <tr><td>データ操作</td><td>DATA step / SQL</td><td>dplyr / tidyverse</td><td>pandas</td></tr>
        <tr><td>SDTM専用パッケージ</td><td>マクロライブラリ</td><td>admiral (pharmaverse)</td><td>開発中</td></tr>
        <tr><td>バリデーション</td><td>Pinnacle 21</td><td>Pinnacle 21</td><td>Pinnacle 21</td></tr>
        <tr><td>FDA申請実績</td><td>多数</td><td>増加中</td><td>少数（増加傾向）</td></tr>
        <tr><td>日付処理</td><td>SAS日付値</td><td>lubridate</td><td>datetime / pandas</td></tr>
        <tr><td>学習曲線</td><td>SDTM特化は容易</td><td>中程度</td><td>汎用性が高い</td></tr>
    </tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">💡 実務での推奨</div>
現時点では、SDTMの本番作成にはSASまたはRが推奨されますが、探索的データ分析やプロトタイピングにはPythonが非常に有効です。将来的にはPythonによるSDTM作成も規制申請での標準的な選択肢になると見込まれています。ハイブリッド環境（SAS + Python）で運用している企業も増えています。
</div>

<div class="key-point">
    <div class="key-point-title">PythonによるSDTMプログラミングのまとめ</div>
    <ul>
        <li><strong>pandas</strong>: データフレーム操作、変数導出、マッピングの中核</li>
        <li><strong>pyreadstat</strong>: SASデータ読み込み・XPT V5出力の必須ライブラリ</li>
        <li><strong>.map() / .replace()</strong>: Controlled Terminologyマッピングに最適</li>
        <li><strong>pd.to_datetime()</strong>: ISO 8601日付変換の基本関数</li>
        <li><strong>pd.melt()</strong>: 横型→縦型変換（VS, LBドメイン等）</li>
        <li><strong>groupby().cumcount()</strong>: --SEQ連番生成の標準パターン</li>
    </ul>
</div>
`,
            quiz: [
                {
                    id: "q305_1",
                    type: "choice",
                    question: "PythonでSAS Transport V5形式（XPT）ファイルを出力するために使用するライブラリはどれですか？",
                    options: [
                        "pandas",
                        "pyreadstat",
                        "numpy",
                        "scipy"
                    ],
                    answer: 1,
                    explanation: "pyreadstatライブラリのwrite_xport()関数を使用してXPT V5形式のファイルを出力します。FDAへの提出に必要なSAS Transport形式に対応しています。"
                },
                {
                    id: "q305_2",
                    type: "choice",
                    question: "pandasでControlled Terminologyの値をマッピングする際に使用するメソッドはどれですか？",
                    options: [
                        ".apply()",
                        ".map()",
                        ".transform()",
                        ".aggregate()"
                    ],
                    answer: 1,
                    explanation: "Series.map()メソッドは辞書を引数として、元の値を対応するControlled Terminology値に変換できます。.replace()も同様に使用可能です。"
                },
                {
                    id: "q305_3",
                    type: "fill",
                    question: "pandasで横型（Wide format）データを縦型（Long format）に変換する関数は pd._____ () です。空欄を入力してください。",
                    answer: "melt",
                    explanation: "pd.melt()は横型データを縦型に変換する関数です。VSドメインやLBドメインなど、CRFの横型データをSDTMの縦型構造に変換する際に不可欠です。"
                },
                {
                    id: "q305_4",
                    type: "choice",
                    question: "pandasで被験者（USUBJID）ごとの連番（AESEQ等）を生成するコードはどれですか？",
                    options: [
                        "df.sort_values('USUBJID').reset_index()",
                        "df.groupby('USUBJID').cumcount() + 1",
                        "df.rank(method='first')",
                        "df.groupby('USUBJID').size()"
                    ],
                    answer: 1,
                    explanation: "groupby('USUBJID').cumcount()は各グループ内で0から始まる連番を生成します。+1することで1始まりの--SEQ変数になります。"
                },
                {
                    id: "q305_5",
                    type: "choice",
                    question: "pandasで日付文字列をISO 8601形式に変換するコードとして正しいものはどれですか？",
                    options: [
                        "pd.to_datetime(date).strftime('%Y-%m-%dT%H:%M:%S')",
                        "pd.to_datetime(date).isoformat()",
                        "pd.to_datetime(date).format('ISO8601')",
                        "pd.to_datetime(date).to_iso()"
                    ],
                    answer: 0,
                    explanation: "pd.to_datetime()で日付文字列をdatetime型に変換し、.strftime('%Y-%m-%dT%H:%M:%S')でISO 8601形式の文字列に変換するのが標準的な方法です。"
                },
                {
                    id: "q305_6",
                    type: "fill",
                    question: "PythonでSASデータセット（.sas7bdat）を読み込むには pyreadstat.read_____() 関数を使用します。空欄を入力してください。",
                    answer: "sas7bdat",
                    explanation: "pyreadstat.read_sas7bdat()でSASデータセットを読み込みます。戻り値はDataFrameとメタデータのタプルで、変数ラベル等のメタ情報も取得できます。"
                }
            ]
        },

        // =====================================================================
        // Module 21: ISO 8601 日付処理 (id: 306)
        // =====================================================================
        {
            id: 306,
            title: "ISO 8601 日付処理",
            duration: "25分",
            content: `
<h2>ISO 8601 日付処理の完全ガイド</h2>

<h3>1. ISO 8601形式の概要</h3>
<p>SDTMでは、全ての日付・時刻変数をISO 8601国際標準形式で格納します。これは文字型変数として保持され、部分的な日付にも対応できる柔軟な形式です。</p>

<table class="sdtm-table">
    <thead>
        <tr><th>形式</th><th>パターン</th><th>例</th><th>説明</th></tr>
    </thead>
    <tbody>
        <tr><td>完全な日付時刻</td><td>YYYY-MM-DDThh:mm:ss</td><td>2024-03-15T10:30:00</td><td>最も詳細な形式</td></tr>
        <tr><td>日付のみ</td><td>YYYY-MM-DD</td><td>2024-03-15</td><td>時刻不要の場合</td></tr>
        <tr><td>年月のみ</td><td>YYYY-MM</td><td>2024-03</td><td>日が不明</td></tr>
        <tr><td>年のみ</td><td>YYYY</td><td>2024</td><td>月日が不明</td></tr>
        <tr><td>日付＋時分</td><td>YYYY-MM-DDThh:mm</td><td>2024-03-15T10:30</td><td>秒を省略</td></tr>
    </tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">💡 なぜISO 8601なのか</div>
<ul>
    <li><strong>文字型格納</strong>：数値日付と異なり、部分的な日付を自然に表現可能</li>
    <li><strong>国際標準</strong>：MM/DD/YYYYやDD/MM/YYYYの曖昧さを排除</li>
    <li><strong>ソート可能</strong>：文字列としてソートしても時系列順になる</li>
    <li><strong>精度の表現</strong>：収集された精度をそのまま保持できる</li>
</ul>
</div>

<h3>2. 完全日付と部分日付（Incomplete Dates）</h3>
<p>臨床試験では、被験者が正確な日付を覚えていないケースが頻繁に発生します。ISO 8601形式では、わかっている部分だけを格納できます。</p>

<table class="sdtm-table">
    <thead>
        <tr><th>状況</th><th>CRF入力例</th><th>ISO 8601格納値</th><th>精度</th></tr>
    </thead>
    <tbody>
        <tr><td>完全な日付</td><td>2024年3月15日 10:30</td><td>2024-03-15T10:30:00</td><td>秒まで</td></tr>
        <tr><td>時刻不明</td><td>2024年3月15日</td><td>2024-03-15</td><td>日まで</td></tr>
        <tr><td>日が不明</td><td>2024年3月</td><td>2024-03</td><td>月まで</td></tr>
        <tr><td>月日が不明</td><td>2024年</td><td>2024</td><td>年まで</td></tr>
        <tr><td>完全に不明</td><td>不明</td><td>（空欄）</td><td>なし</td></tr>
    </tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">⚠️ 重要な原則</div>
部分日付では、不明な部分を「推測」して埋めてはいけません。CRFで収集された精度のまま格納するのがSDTMの原則です。日付の補完（Imputation）はADaMレベルで行い、補完フラグ（--DTFLAG）で補完の有無と方法を記録します。
</div>

<h3>3. --DTC変数の命名規則</h3>
<p>SDTMでは、日付・時刻を格納する変数名は全て<strong>DTC</strong>で終わります。これによりISO 8601文字型変数であることが明示されます。</p>

<table class="sdtm-table">
    <thead>
        <tr><th>ドメイン</th><th>変数名</th><th>説明</th><th>例</th></tr>
    </thead>
    <tbody>
        <tr><td>DM</td><td>RFSTDTC</td><td>被験者参照開始日時</td><td>2024-01-15</td></tr>
        <tr><td>DM</td><td>RFENDTC</td><td>被験者参照終了日時</td><td>2024-06-30</td></tr>
        <tr><td>DM</td><td>BRTHDTC</td><td>生年月日</td><td>1985-07-22</td></tr>
        <tr><td>AE</td><td>AESTDTC</td><td>有害事象発現日時</td><td>2024-03-15T10:30</td></tr>
        <tr><td>AE</td><td>AEENDTC</td><td>有害事象回復日時</td><td>2024-03-20</td></tr>
        <tr><td>EX</td><td>EXSTDTC</td><td>投与開始日時</td><td>2024-01-15T08:00:00</td></tr>
        <tr><td>LB</td><td>LBDTC</td><td>検体採取日時</td><td>2024-02-10T07:45:00</td></tr>
        <tr><td>VS</td><td>VSDTC</td><td>バイタルサイン測定日時</td><td>2024-02-10T08:00</td></tr>
    </tbody>
</table>

<h3>4. Duration形式（期間の表現）</h3>
<p>ISO 8601ではP[n]Y[n]M[n]DT[n]H[n]M[n]S形式で期間を表現します。SDTMでは<strong>--DUR</strong>変数に使用します。</p>

<table class="sdtm-table">
    <thead>
        <tr><th>期間</th><th>ISO 8601 Duration</th><th>説明</th></tr>
    </thead>
    <tbody>
        <tr><td>2年3ヶ月</td><td>P2Y3M</td><td>Pは期間の開始記号</td></tr>
        <tr><td>30日</td><td>P30D</td><td>日のみ</td></tr>
        <tr><td>1年6ヶ月15日</td><td>P1Y6M15D</td><td>年月日の組み合わせ</td></tr>
        <tr><td>2時間30分</td><td>PT2H30M</td><td>Tは時刻部分の開始記号</td></tr>
        <tr><td>1日12時間</td><td>P1DT12H</td><td>日と時間の組み合わせ</td></tr>
        <tr><td>90秒</td><td>PT90S</td><td>秒のみ</td></tr>
    </tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">💡 Duration形式の覚え方</div>
<strong>P</strong> = Period（期間の開始）、<strong>Y</strong> = Year、<strong>M</strong> = Month（Tの前）、<strong>D</strong> = Day、<strong>T</strong> = Time（時刻部分の区切り）、<strong>H</strong> = Hour、<strong>M</strong> = Minute（Tの後）、<strong>S</strong> = Second。例えばAEDUR（有害事象の持続期間）は P5D（5日間）のように格納されます。
</div>

<h3>5. Study Day（--DY）の算出</h3>
<p>Study Day（--DY）は、被験者の参照開始日（RFSTDTC）からの日数を表します。SDTMにおいて最も重要な日付計算の1つです。</p>

<h4>算出ルール</h4>
<table class="sdtm-table">
    <thead>
        <tr><th>条件</th><th>計算式</th><th>例（RFSTDTC = 2024-01-15）</th></tr>
    </thead>
    <tbody>
        <tr><td>イベント日 ≥ RFSTDTC</td><td>DY = イベント日 − RFSTDTC + 1</td><td>2024-01-15 → DY = 1（当日）</td></tr>
        <tr><td>イベント日 &lt; RFSTDTC</td><td>DY = イベント日 − RFSTDTC</td><td>2024-01-14 → DY = −1（前日）</td></tr>
    </tbody>
</table>

<div class="info-box danger">
<div class="info-box-title">🚫 Day 0は存在しない</div>
Study Dayの計算では<strong>Day 0は存在しません</strong>。投与開始日がDay 1で、その前日がDay −1です。これはSDTMの最も頻出するエラーの1つであり、バリデーションルールSD1020で検出されます。
<br><br>
<strong>正しい例</strong>（RFSTDTC = 2024-01-15の場合）：<br>
...Day −2, Day −1, <strong>Day 1</strong>, Day 2, Day 3...<br>
（Day 0 は存在しない）
</div>

<h4>SAS / R / Python での実装</h4>

<div class="code-tabs">
    <div class="code-tab-buttons">
        <button class="code-tab-btn active" onclick="App.switchCodeTab(this,'sas')">SAS</button>
        <button class="code-tab-btn" onclick="App.switchCodeTab(this,'r')">R</button>
        <button class="code-tab-btn" onclick="App.switchCodeTab(this,'python')">Python</button>
    </div>
    <div class="code-tab-content active" data-lang="sas">
        <pre><code class="language-sas">
/* Study Day の算出（SAS） */
data ae_dy;
    set sdtm.ae;
    if not missing(AESTDTC) and not missing(RFSTDTC) then do;
        _aestdt = input(AESTDTC, yymmdd10.);
        _rfstdt = input(RFSTDTC, yymmdd10.);
        if _aestdt >= _rfstdt then
            AESTDY = _aestdt - _rfstdt + 1;
        else
            AESTDY = _aestdt - _rfstdt;
    end;
    drop _aestdt _rfstdt;
run;
        </code></pre>
    </div>
    <div class="code-tab-content" data-lang="r">
        <pre><code class="language-r">
# Study Day の算出（R）
library(dplyr)
library(lubridate)

ae <- ae %>%
  mutate(
    aestdt = as.Date(AESTDTC),
    rfstdt = as.Date(RFSTDTC),
    AESTDY = case_when(
      is.na(aestdt) | is.na(rfstdt) ~ NA_real_,
      aestdt >= rfstdt ~ as.numeric(aestdt - rfstdt) + 1,
      TRUE ~ as.numeric(aestdt - rfstdt)
    )
  ) %>%
  select(-aestdt, -rfstdt)
        </code></pre>
    </div>
    <div class="code-tab-content" data-lang="python">
        <pre><code class="language-python">
# Study Day の算出（Python）
import pandas as pd
import numpy as np

def calc_study_day(dtc, rfstdtc):
    """Day 0を飛ばすStudy Day計算"""
    if pd.isna(dtc) or pd.isna(rfstdtc):
        return np.nan
    diff = (pd.to_datetime(dtc) - pd.to_datetime(rfstdtc)).days
    return diff + 1 if diff >= 0 else diff

ae["AESTDY"] = ae.apply(
    lambda row: calc_study_day(row["AESTDTC"], row["RFSTDTC"]),
    axis=1
)
        </code></pre>
    </div>
</div>

<h3>6. 日付の補完（Date Imputation）</h3>
<p>臨床試験では部分日付が避けられません。ADaMでの解析に向けて、SDTMレベルでは部分日付をそのまま保持し、ADaMレベルで補完ルールを適用します。</p>

<h4>補完の基本方針</h4>
<table class="sdtm-table">
    <thead>
        <tr><th>日付の種類</th><th>補完方針</th><th>理由</th><th>例（2024年、月日不明）</th></tr>
    </thead>
    <tbody>
        <tr><td><strong>開始日</strong></td><td>遅い方（最大値）に補完</td><td>安全性報告で保守的</td><td>2024-12-31</td></tr>
        <tr><td><strong>終了日</strong></td><td>早い方（最小値）に補完</td><td>期間を短く見積もる</td><td>2024-01-01</td></tr>
    </tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">⚠️ 補完フラグ（Imputation Flag）</div>
日付を補完した場合は、必ず対応する<strong>--DTFLAG</strong>変数に補完内容を記録します。
<br><br>
<table class="sdtm-table">
    <thead>
        <tr><th>フラグ値</th><th>意味</th><th>例</th></tr>
    </thead>
    <tbody>
        <tr><td>D</td><td>日を補完</td><td>2024-03 → 2024-03-01</td></tr>
        <tr><td>M</td><td>月（と日）を補完</td><td>2024 → 2024-01-01</td></tr>
        <tr><td>Y</td><td>年を補完</td><td>（稀）</td></tr>
        <tr><td>H</td><td>時を補完</td><td>時刻不明の補完</td></tr>
        <tr><td>N</td><td>分を補完</td><td>分不明の補完</td></tr>
    </tbody>
</table>
</div>

<h3>7. SAS / R / Python での日付変換</h3>
<p>各プログラミング言語での日付変換の実装方法を比較します。</p>

<div class="code-tabs">
    <div class="code-tab-buttons">
        <button class="code-tab-btn active" onclick="App.switchCodeTab(this,'sas')">SAS</button>
        <button class="code-tab-btn" onclick="App.switchCodeTab(this,'r')">R</button>
        <button class="code-tab-btn" onclick="App.switchCodeTab(this,'python')">Python</button>
    </div>
    <div class="code-tab-content active" data-lang="sas">
        <pre><code class="language-sas">
/* SASでの日付変換 */

/* 文字型 → SAS日付値 → ISO 8601文字列 */
data dates;
    /* CRFの日付形式を読み込み */
    raw_date = "15MAR2024";
    sas_date = input(raw_date, date9.);

    /* ISO 8601形式に変換 */
    iso_date = put(sas_date, yymmdd10.);
    /* 結果: "2024-03-15" */

    /* 日付時刻の場合 */
    raw_datetime = "15MAR2024:10:30:00";
    sas_datetime = input(raw_datetime, datetime20.);
    iso_datetime = put(datepart(sas_datetime), yymmdd10.)
                || "T" || put(timepart(sas_datetime), time8.);
    /* 結果: "2024-03-15T10:30:00" */

    /* 部分日付の処理 */
    raw_partial = "MAR2024";  /* 日が不明 */
    iso_partial = cats(put(input("01" || raw_partial, date9.), yymmn7.));
    /* 結果: "2024-03" */
run;
        </code></pre>
    </div>
    <div class="code-tab-content" data-lang="r">
        <pre><code class="language-r">
# Rでの日付変換
library(lubridate)

# 文字型 → Date型 → ISO 8601文字列
raw_date <- "15MAR2024"
r_date <- dmy(raw_date)  # lubridateで解析
iso_date <- format(r_date, "%Y-%m-%d")
# 結果: "2024-03-15"

# as.Dateを使用
r_date2 <- as.Date("15MAR2024", format = "%d%b%Y")
iso_date2 <- format(r_date2, "%Y-%m-%d")

# 日付時刻の場合
raw_datetime <- "15MAR2024 10:30:00"
r_datetime <- dmy_hms(raw_datetime)
iso_datetime <- format(r_datetime, "%Y-%m-%dT%H:%M:%S")
# 結果: "2024-03-15T10:30:00"

# DataFrameでの一括変換
df <- df %>%
  mutate(
    AESTDTC = format(as.Date(AE_START, "%d%b%Y"), "%Y-%m-%d"),
    AEENDTC = format(as.Date(AE_END, "%d%b%Y"), "%Y-%m-%d")
  )
        </code></pre>
    </div>
    <div class="code-tab-content" data-lang="python">
        <pre><code class="language-python">
# Pythonでの日付変換
from datetime import datetime
import pandas as pd

# 文字型 → datetime → ISO 8601文字列
raw_date = "15MAR2024"
py_date = datetime.strptime(raw_date, "%d%b%Y")
iso_date = py_date.strftime("%Y-%m-%d")
# 結果: "2024-03-15"

# pandasでの変換
raw_datetime = "15MAR2024 10:30:00"
py_datetime = pd.to_datetime(raw_datetime, format="%d%b%Y %H:%M:%S")
iso_datetime = py_datetime.strftime("%Y-%m-%dT%H:%M:%S")
# 結果: "2024-03-15T10:30:00"

# DataFrameでの一括変換
df["AESTDTC"] = pd.to_datetime(
    df["AE_START"], format="%d%b%Y"
).dt.strftime("%Y-%m-%d")

# 部分日付の処理
def to_iso8601(year, month=None, day=None):
    """部分日付をISO 8601形式に変換"""
    if year is None:
        return ""
    if month is None:
        return f"{year:04d}"
    if day is None:
        return f"{year:04d}-{month:02d}"
    return f"{year:04d}-{month:02d}-{day:02d}"

# 例
print(to_iso8601(2024, 3, 15))  # "2024-03-15"
print(to_iso8601(2024, 3))       # "2024-03"
print(to_iso8601(2024))           # "2024"
        </code></pre>
    </div>
</div>

<h3>8. よくある落とし穴と注意点</h3>

<h4>8.1 タイムゾーンの扱い</h4>
<p>SDTMでは原則としてタイムゾーン情報は格納しません。ただし、多施設国際共同治験では各施設の現地時刻を使用するのが一般的です。</p>

<div class="info-box warning">
<div class="info-box-title">⚠️ タイムゾーンの注意点</div>
<ul>
    <li>SDTMにはタイムゾーン変数は定義されていない</li>
    <li>ISO 8601の "+09:00" 形式は通常使用しない</li>
    <li>UTC変換が必要な場合はSuppQualで補足情報を提供</li>
    <li>プログラミング言語のデフォルトタイムゾーン設定に注意（特にPython/R）</li>
</ul>
</div>

<h4>8.2 部分日付の比較</h4>
<p>部分日付同士を直接比較することはできません。文字列比較では正確な結果が得られない場合があります。</p>

<div class="code-block"><div class="code-block-header"><span class="code-lang">Python</span></div><pre><code class="language-python">
# 部分日付の比較の問題
start = "2024-03"     # 月まで
end   = "2024-03-15"  # 日まで

# 文字列比較では不正確になる場合がある
# "2024-03" < "2024-03-15" → True（文字列として）
# しかし実際の日付の前後関係は不明（日が不明なため）

# 正しいアプローチ: 精度を揃えてから比較
def compare_partial_dates(date1, date2):
    """部分日付の比較（共通精度で比較）"""
    min_len = min(len(date1), len(date2))
    return date1[:min_len], date2[:min_len]
</code></pre></div>

<h4>8.3 Day 0の不在</h4>
<p>Study Day計算で最も多いエラーは<strong>Day 0を含めてしまうこと</strong>です。</p>

<table class="sdtm-table">
    <thead>
        <tr><th>日付</th><th>RFSTDTC</th><th>誤った計算</th><th>正しいStudy Day</th></tr>
    </thead>
    <tbody>
        <tr><td>2024-01-13</td><td>2024-01-15</td><td>−2</td><td><strong>−2</strong></td></tr>
        <tr><td>2024-01-14</td><td>2024-01-15</td><td>−1</td><td><strong>−1</strong></td></tr>
        <tr><td>2024-01-15</td><td>2024-01-15</td><td>0 ❌</td><td><strong>1</strong></td></tr>
        <tr><td>2024-01-16</td><td>2024-01-15</td><td>1</td><td><strong>2</strong></td></tr>
        <tr><td>2024-01-17</td><td>2024-01-15</td><td>2</td><td><strong>3</strong></td></tr>
    </tbody>
</table>

<h4>8.4 月またぎの期間計算</h4>
<p>月ごとに日数が異なるため、期間計算には注意が必要です。ISO 8601のDuration形式では月を使えますが、正確な日数変換は文脈依存です。</p>

<div class="info-box tip">
<div class="info-box-title">💡 期間計算のベストプラクティス</div>
<ul>
    <li>日数ベースの計算が最も正確（P30DよりもP1Mを避ける）</li>
    <li>SDTMでは--DURに格納し、--DY変数は日数ベースで算出</li>
    <li>うるう年の考慮が必要（2024年2月は29日）</li>
    <li>SAS/R/Pythonの日付計算関数を使用し、手動計算は避ける</li>
</ul>
</div>

<h3>9. CRF形式からISO 8601への変換一覧</h3>
<p>実務でよく遭遇するCRF収集形式と、対応するISO 8601変換の一覧です。</p>

<table class="sdtm-table">
    <thead>
        <tr><th>CRF形式</th><th>入力例</th><th>ISO 8601出力</th><th>備考</th></tr>
    </thead>
    <tbody>
        <tr><td>DD-MMM-YYYY</td><td>15-Mar-2024</td><td>2024-03-15</td><td>英語月名略称</td></tr>
        <tr><td>MM/DD/YYYY</td><td>03/15/2024</td><td>2024-03-15</td><td>米国形式</td></tr>
        <tr><td>DD/MM/YYYY</td><td>15/03/2024</td><td>2024-03-15</td><td>欧州形式</td></tr>
        <tr><td>YYYY年MM月DD日</td><td>2024年03月15日</td><td>2024-03-15</td><td>日本形式</td></tr>
        <tr><td>DDMONYYYY:HH:MM:SS</td><td>15MAR2024:10:30:00</td><td>2024-03-15T10:30:00</td><td>SAS形式</td></tr>
        <tr><td>MMM-YYYY（日不明）</td><td>Mar-2024</td><td>2024-03</td><td>部分日付</td></tr>
        <tr><td>YYYY（月日不明）</td><td>2024</td><td>2024</td><td>部分日付</td></tr>
        <tr><td>UN-UNK-YYYY</td><td>UN-UNK-2024</td><td>2024</td><td>月日が不明</td></tr>
    </tbody>
</table>

<div class="key-point">
    <div class="key-point-title">ISO 8601 日付処理のまとめ</div>
    <ul>
        <li><strong>ISO 8601形式</strong>: YYYY-MM-DDThh:mm:ss — SDTMの日付標準</li>
        <li><strong>部分日付</strong>: 不明な部分は省略して文字型で格納（補完しない）</li>
        <li><strong>Duration</strong>: P[n]Y[n]M[n]DT[n]H[n]M[n]S 形式で期間を表現</li>
        <li><strong>--DTC変数</strong>: 全ての日付変数はDTCで終わる命名規則</li>
        <li><strong>--DY計算</strong>: Day 0は存在しない（RFSTDTC当日 = Day 1）</li>
        <li><strong>補完フラグ</strong>: --DTFLAGで補完の有無と粒度を記録</li>
        <li><strong>タイムゾーン</strong>: SDTMでは原則格納しない</li>
    </ul>
</div>
`,
            quiz: [
                {
                    id: "q306_1",
                    type: "choice",
                    question: "ISO 8601形式で「2024年3月15日 午前10時30分」を表す正しい形式はどれですか？",
                    options: [
                        "03/15/2024 10:30",
                        "2024-03-15T10:30:00",
                        "15-Mar-2024 10:30:00",
                        "2024/03/15 10:30:00"
                    ],
                    answer: 1,
                    explanation: "ISO 8601形式ではYYYY-MM-DDThh:mm:ssの形式を使用します。日付と時刻の区切りには大文字のTを使用します。"
                },
                {
                    id: "q306_2",
                    type: "fill",
                    question: "SDTMのStudy Day計算で、RFSTDTCと同日のイベントのStudy Dayは _____ です。数字で入力してください。",
                    answer: "1",
                    explanation: "Study Day計算ではDay 0は存在しません。RFSTDTC当日（イベント日 ≥ RFSTDTC）の場合、DY = イベント日 − RFSTDTC + 1 = 0 + 1 = 1となります。"
                },
                {
                    id: "q306_3",
                    type: "choice",
                    question: "ISO 8601のDuration形式で「2年3ヶ月」を表す正しい形式はどれですか？",
                    options: [
                        "2Y3M",
                        "P2Y3M",
                        "D2Y3M",
                        "PT2Y3M"
                    ],
                    answer: 1,
                    explanation: "ISO 8601のDuration形式はPで始まります。P2Y3Mは2年（2Y）3ヶ月（3M）を意味します。Tは時刻部分（時・分・秒）の開始を示す区切りで、年月日にはTは付きません。"
                },
                {
                    id: "q306_4",
                    type: "choice",
                    question: "被験者が有害事象の開始日を「2024年のどこか」としか覚えていない場合、AESTDTCに格納する値として正しいものはどれですか？",
                    options: [
                        "2024-01-01",
                        "2024-06-15",
                        "2024",
                        "2024-UN-UN"
                    ],
                    answer: 2,
                    explanation: "年のみ判明している場合、ISO 8601では「2024」と年のみを格納します。不明な部分を勝手に補完してはいけません。SDTMでは収集された精度のまま保持します。"
                },
                {
                    id: "q306_5",
                    type: "fill",
                    question: "日付を補完した場合に、補完の有無と内容を記録するSDTM変数の接尾辞は _____ です。",
                    answer: "DTFLAG",
                    explanation: "--DTFLAG変数は日付補完（Date Imputation）の有無と内容を記録します。例えばAESTDTFLAGに「D」が入っている場合、AESTDTCの日が補完されたことを意味します。"
                },
                {
                    id: "q306_6",
                    type: "choice",
                    question: "部分日付の開始日を補完する際の一般的な方針として正しいものはどれですか？",
                    options: [
                        "最も早い日付に補完する",
                        "最も遅い日付に補完する",
                        "月の中央値（15日）に補完する",
                        "補完しない"
                    ],
                    answer: 1,
                    explanation: "開始日は最も遅い日付（最大値）に補完するのが一般的です。これにより有害事象の発現時期を保守的（安全側）に見積もることができます。逆に終了日は最も早い日付に補完します。"
                }
            ]
        }
    ]
};
