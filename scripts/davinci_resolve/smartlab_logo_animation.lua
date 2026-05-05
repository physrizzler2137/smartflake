-- SMaRT-Lab Kinetic Typography Animation Script for DaVinci Resolve (Fusion)
-- This script describes the setup for the logo animation logic used in the SMaRT-Lab website.
-- To use: Copy-paste the logic into a Fusion Composition or use as a reference for node setup.

-- CONFIGURATION
local FONT_FAMILY = "Roboto Slab"
local FONT_STYLE = "Medium"
local ANIMATION_DURATION = 120 -- 4 Seconds at 30fps
local GOLD_COLOR = {R = 0.85, G = 0.75, B = 0.55} -- Approximate #B8A281

function SetupLogoFusion()
    -- 1. Create Background Node (Transparent)
    local background = Background({
        Name = "LogoBG",
        TopLeftRed = 0, TopLeftGreen = 0, TopLeftBlue = 0, TopLeftAlpha = 0
    })

    -- 2. Create Text Segments
    -- Segment: SM
    local textSM = TextPlus({
        Name = "Text_SM",
        StyledText = "SM",
        Font = FONT_FAMILY,
        Style = FONT_STYLE,
        Red1 = GOLD_COLOR.R, Green1 = GOLD_COLOR.G, Blue1 = GOLD_COLOR.B
    })

    -- Segment: a (The jumping character)
    local textA = TextPlus({
        Name = "Text_a",
        StyledText = "a",
        Font = FONT_FAMILY,
        Style = FONT_STYLE,
        Red1 = GOLD_COLOR.R, Green1 = GOLD_COLOR.G, Blue1 = GOLD_COLOR.B
    })

    -- Segment: RT- (Joint with hyphen)
    local textRT = TextPlus({
        Name = "Text_RT",
        StyledText = "RT-",
        Font = FONT_FAMILY,
        Style = FONT_STYLE,
        Red1 = GOLD_COLOR.R, Green1 = GOLD_COLOR.G, Blue1 = GOLD_COLOR.B
    })

    -- Segment: Lab (Static suffix)
    local textLab = TextPlus({
        Name = "Text_Lab",
        StyledText = "Lab",
        Font = FONT_FAMILY,
        Style = FONT_STYLE,
        Red1 = GOLD_COLOR.R, Green1 = GOLD_COLOR.G, Blue1 = GOLD_COLOR.B
    })

    -- 3. ANIMATION LOGIC (Keyframes)
    
    -- [SM] Squeeze Animation
    textSM.Center:SetKeyFrame(0, {0.45, 0.5})
    textSM.Center:SetKeyFrame(45, {0.462, 0.5}) -- Translate +0.012
    textSM.Center:SetKeyFrame(120, {0.45, 0.5})

    -- [a] Pop Animation
    textA.Size:SetKeyFrame(0, 1.0)
    textA.Size:SetKeyFrame(45, 0.5) -- Compress
    textA.Size:SetKeyFrame(60, 1.6) -- Pop
    textA.Size:SetKeyFrame(120, 1.0)
    
    textA.Center:SetKeyFrame(0, {0.5, 0.483}) -- Shifted Y
    textA.Center:SetKeyFrame(60, {0.5, 0.46})  -- Jump Up
    textA.Center:SetKeyFrame(120, {0.5, 0.483})

    -- [RT-] Squeeze Animation
    textRT.Center:SetKeyFrame(0, {0.55, 0.5})
    textRT.Center:SetKeyFrame(45, {0.538, 0.5}) -- Translate -0.012
    textRT.Center:SetKeyFrame(120, {0.55, 0.5})

    -- 4. Merge nodes sequentially
    -- Merge(Merge(Merge(BG, SM), a), RT), Lab)
    -- Spline Smoothing: All keyframes set to Cubic/Bezier for smooth bounce.
end

print("SMaRT-Lab Logo Animation Logic Exported.")
