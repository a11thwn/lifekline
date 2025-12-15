import React, { useState, useMemo } from "react";
import { UserInput, Gender } from "../types";
import {
  Sparkles,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface BaziFormProps {
  onGeneratePrompt: (data: UserInput) => void;
}

// 六十甲子列表
const SIXTY_JIAZI = [
  "甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉",
  "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未",
  "甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳",
  "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯",
  "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑",
  "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥",
];

// 校验是否是有效的六十甲子
const isValidJiazi = (value: string): boolean => {
  return SIXTY_JIAZI.includes(value.trim());
};

// 校验起运年龄是否是1-11之间的整数
const isValidStartAge = (value: string): boolean => {
  const num = parseInt(value, 10);
  return !isNaN(num) && num >= 1 && num <= 11 && Number.isInteger(num);
};

// 校验出生年份
const isValidBirthYear = (value: string): boolean => {
  const num = parseInt(value, 10);
  return !isNaN(num) && num >= 1900 && num <= 2100;
};

interface ValidationErrors {
  birthYear?: string;
  yearPillar?: string;
  monthPillar?: string;
  dayPillar?: string;
  hourPillar?: string;
  startAge?: string;
  firstDaYun?: string;
}

const BaziForm: React.FC<BaziFormProps> = ({ onGeneratePrompt }) => {
  const [formData, setFormData] = useState<UserInput>({
    name: "",
    gender: Gender.MALE,
    birthYear: "",
    yearPillar: "",
    monthPillar: "",
    dayPillar: "",
    hourPillar: "",
    startAge: "",
    firstDaYun: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // 实时校验
    validateField(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    
    switch (name) {
      case "birthYear":
        if (!value.trim()) {
          error = "请输入出生年份";
        } else if (!isValidBirthYear(value)) {
          error = "年份需在1900-2100之间";
        }
        break;
      case "yearPillar":
      case "monthPillar":
      case "dayPillar":
      case "hourPillar":
        if (!value.trim()) {
          error = "请输入干支";
        } else if (!isValidJiazi(value)) {
          error = "请输入有效的六十甲子";
        }
        break;
      case "startAge":
        if (!value.trim()) {
          error = "请输入起运年龄";
        } else if (!isValidStartAge(value)) {
          error = "需为1-11的整数";
        }
        break;
      case "firstDaYun":
        if (!value.trim()) {
          error = "请输入第一步大运";
        } else if (!isValidJiazi(value)) {
          error = "请输入有效的六十甲子";
        }
        break;
    }
    
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // 校验整个表单
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.birthYear.trim()) {
      newErrors.birthYear = "请输入出生年份";
    } else if (!isValidBirthYear(formData.birthYear)) {
      newErrors.birthYear = "年份需在1900-2100之间";
    }

    if (!formData.yearPillar.trim()) {
      newErrors.yearPillar = "请输入年柱";
    } else if (!isValidJiazi(formData.yearPillar)) {
      newErrors.yearPillar = "请输入有效的六十甲子";
    }

    if (!formData.monthPillar.trim()) {
      newErrors.monthPillar = "请输入月柱";
    } else if (!isValidJiazi(formData.monthPillar)) {
      newErrors.monthPillar = "请输入有效的六十甲子";
    }

    if (!formData.dayPillar.trim()) {
      newErrors.dayPillar = "请输入日柱";
    } else if (!isValidJiazi(formData.dayPillar)) {
      newErrors.dayPillar = "请输入有效的六十甲子";
    }

    if (!formData.hourPillar.trim()) {
      newErrors.hourPillar = "请输入时柱";
    } else if (!isValidJiazi(formData.hourPillar)) {
      newErrors.hourPillar = "请输入有效的六十甲子";
    }

    if (!formData.startAge.trim()) {
      newErrors.startAge = "请输入起运年龄";
    } else if (!isValidStartAge(formData.startAge)) {
      newErrors.startAge = "需为1-11的整数";
    }

    if (!formData.firstDaYun.trim()) {
      newErrors.firstDaYun = "请输入第一步大运";
    } else if (!isValidJiazi(formData.firstDaYun)) {
      newErrors.firstDaYun = "请输入有效的六十甲子";
    }

    setErrors(newErrors);
    // 标记所有字段为已触碰
    setTouched({
      birthYear: true,
      yearPillar: true,
      monthPillar: true,
      dayPillar: true,
      hourPillar: true,
      startAge: true,
      firstDaYun: true,
    });
    
    return Object.keys(newErrors).length === 0;
  };

  // 检查表单是否可以提交（用于按钮状态）
  const isFormValid = useMemo(() => {
    return (
      formData.birthYear.trim() !== "" &&
      isValidBirthYear(formData.birthYear) &&
      formData.yearPillar.trim() !== "" &&
      isValidJiazi(formData.yearPillar) &&
      formData.monthPillar.trim() !== "" &&
      isValidJiazi(formData.monthPillar) &&
      formData.dayPillar.trim() !== "" &&
      isValidJiazi(formData.dayPillar) &&
      formData.hourPillar.trim() !== "" &&
      isValidJiazi(formData.hourPillar) &&
      formData.startAge.trim() !== "" &&
      isValidStartAge(formData.startAge) &&
      formData.firstDaYun.trim() !== "" &&
      isValidJiazi(formData.firstDaYun)
    );
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onGeneratePrompt(formData);
    }
  };

  // Calculate direction for UI feedback
  const daYunDirectionInfo = useMemo(() => {
    if (!formData.yearPillar || !isValidJiazi(formData.yearPillar)) return "等待输入年柱...";

    const firstChar = formData.yearPillar.trim().charAt(0);
    const yangStems = ["甲", "丙", "戊", "庚", "壬"];

    const isYangYear = yangStems.includes(firstChar);

    let isForward = false;
    if (formData.gender === Gender.MALE) {
      isForward = isYangYear; // Male Yang = Forward, Male Yin = Backward
    } else {
      isForward = !isYangYear; // Female Yin = Forward, Female Yang = Backward
    }

    return isForward ? "顺行 (阳男/阴女)" : "逆行 (阴男/阳女)";
  }, [formData.yearPillar, formData.gender]);

  // 输入框样式（根据错误状态）
  const getInputClassName = (fieldName: string, baseClasses: string) => {
    const hasError = touched[fieldName] && errors[fieldName as keyof ValidationErrors];
    return `${baseClasses} ${hasError ? "border-red-400 focus:ring-red-500" : ""}`;
  };

  // 错误提示组件
  const ErrorMessage = ({ field }: { field: keyof ValidationErrors }) => {
    if (!touched[field] || !errors[field]) return null;
    return (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {errors[field]}
      </p>
    );
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-serif-sc font-bold text-gray-800 mb-2">
          八字排盘
        </h2>
        <p className="text-gray-500 text-sm">请输入四柱与大运信息以生成分析</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name & Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名 (可选)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="姓名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              性别
            </label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, gender: Gender.MALE })
                }
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition ${
                  formData.gender === Gender.MALE
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                乾造 (男)
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, gender: Gender.FEMALE })
                }
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition ${
                  formData.gender === Gender.FEMALE
                    ? "bg-white text-pink-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                坤造 (女)
              </button>
            </div>
          </div>
        </div>

        {/* Four Pillars Manual Input */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <div className="flex items-center gap-2 mb-3 text-amber-800 text-sm font-bold">
            <Sparkles className="w-4 h-4" />
            <span>输入四柱干支 (必填)</span>
          </div>

          {/* Birth Year Input */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-600 mb-1">
              出生年份 (阳历)
            </label>
            <input
              type="number"
              name="birthYear"
              required
              min="1900"
              max="2100"
              value={formData.birthYear}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="如: 1990"
              className={getInputClassName(
                "birthYear",
                "w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white font-bold"
              )}
            />
            <ErrorMessage field="birthYear" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                年柱 (Year)
              </label>
              <input
                type="text"
                name="yearPillar"
                required
                value={formData.yearPillar}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="如: 甲子"
                className={getInputClassName(
                  "yearPillar",
                  "w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-center font-serif-sc font-bold"
                )}
              />
              <ErrorMessage field="yearPillar" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                月柱 (Month)
              </label>
              <input
                type="text"
                name="monthPillar"
                required
                value={formData.monthPillar}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="如: 丙寅"
                className={getInputClassName(
                  "monthPillar",
                  "w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-center font-serif-sc font-bold"
                )}
              />
              <ErrorMessage field="monthPillar" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                日柱 (Day)
              </label>
              <input
                type="text"
                name="dayPillar"
                required
                value={formData.dayPillar}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="如: 戊辰"
                className={getInputClassName(
                  "dayPillar",
                  "w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-center font-serif-sc font-bold"
                )}
              />
              <ErrorMessage field="dayPillar" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                时柱 (Hour)
              </label>
              <input
                type="text"
                name="hourPillar"
                required
                value={formData.hourPillar}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="如: 壬戌"
                className={getInputClassName(
                  "hourPillar",
                  "w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-center font-serif-sc font-bold"
                )}
              />
              <ErrorMessage field="hourPillar" />
            </div>
          </div>
        </div>

        {/* Da Yun Manual Input */}
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-2 mb-3 text-indigo-800 text-sm font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>大运排盘信息 (必填)</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                起运年龄 (虚岁)
              </label>
              <input
                type="number"
                name="startAge"
                required
                min="1"
                max="11"
                value={formData.startAge}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="如: 3"
                className={getInputClassName(
                  "startAge",
                  "w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-center font-bold"
                )}
              />
              <ErrorMessage field="startAge" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                第一步大运
              </label>
              <input
                type="text"
                name="firstDaYun"
                required
                value={formData.firstDaYun}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="如: 丁卯"
                className={getInputClassName(
                  "firstDaYun",
                  "w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-center font-serif-sc font-bold"
                )}
              />
              <ErrorMessage field="firstDaYun" />
            </div>
          </div>
          <p className="text-xs text-indigo-600/70 mt-2 text-center">
            当前大运排序规则：
            <span className="font-bold text-indigo-900">
              {daYunDirectionInfo}
            </span>
          </p>
        </div>

        {/* 提示信息 */}
        <p className="text-xs text-gray-400 text-center">
          四柱和大运需输入有效的六十甲子（如：甲子、乙丑、丙寅等）
        </p>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full font-bold py-3.5 rounded-xl shadow-lg transform transition-all flex items-center justify-center gap-2 ${
            isFormValid
              ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.01] active:scale-[0.99]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Sparkles className={`h-5 w-5 ${isFormValid ? "text-amber-300" : "text-gray-400"}`} />
          <span>第一步：生成提示词 (Prompt)</span>
        </button>
      </form>
    </div>
  );
};

export default BaziForm;
