// Small source excerpts from the supplied places, not the complete place files.
window.PORTFOLIO = {
  projects: {
    anticheat: {
      name: 'anticheat system',
      file: 'AnticheatPlace.rbxl / ACPlayer / SpeedA',
      description: 'A modular server-side anticheat prototype. SpeedA measures horizontal displacement over time; FlyA tracks vertical movement and remembers the last grounded position for rollback. The preview below uses the actual speed threshold from the supplied source.',
      card: `local delta = currentPosition - lastPosition[userId]
local distance = Vector3.new(delta.X, 0, delta.Z).Magnitude

local maxSpeed = 19
local maxDistance = maxSpeed * deltaTime

if distance > maxDistance then`,
      source: `local deltaTime = currentTime - lastCheck[userId]

if deltaTime > 0.25 then
    local delta = currentPosition - lastPosition[userId]
    local distance = Vector3.new(delta.X, 0, delta.Z).Magnitude

    local maxSpeed = 19
    local maxDistance = maxSpeed * deltaTime

    if distance > maxDistance then
        local pivot = character:GetPivot()
        character:PivotTo(CFrame.new(lastPosition[userId]) * pivot.Rotation)
        currentPosition = lastPosition[userId]
    end

    lastCheck[userId] = currentTime
    lastPosition[userId] = currentPosition
end`,
      note: 'Excerpt with the diagnostic warn line omitted and indentation normalized. This is a prototype, not a claim of exploit-proof protection.'
    },
    movement: {
      name: 'movement system',
      file: 'MovementSystem.rbxl / LocalScript',
      description: 'A custom client-side controller with a capsule visual and box-shaped collision sweeps. It combines camera-relative input, wall sliding, ground snapping, step traversal, and independent gravity. The jump preview uses the source’s gravity and jump-speed constants.',
      card: `local CustomGravity = 110
local MaxFallSpeed = 70
local JumpSpeed = 36

local StepHeight = 1.25
local SnapDownDistance = 2
local SkinWidth = 0.03`,
      source: `local function getSlideDelta(MoveDelta: Vector3, WallNormal: Vector3): Vector3
    local FlatNormal = Vector3.new(WallNormal.X, 0, WallNormal.Z)

    if FlatNormal.Magnitude <= 0 then
        return Vector3.zero
    end

    FlatNormal = FlatNormal.Unit

    local IntoWallAmount = MoveDelta:Dot(FlatNormal)
    local SlideDelta = MoveDelta - FlatNormal * IntoWallAmount

    if SlideDelta.Magnitude > MoveDelta.Magnitude then
        SlideDelta = SlideDelta.Unit * MoveDelta.Magnitude
    end

    return SlideDelta
end`,
      note: 'Actual getSlideDelta function from the supplied place; indentation normalized. Built-in Roblox PlayerModule code is not presented as original work.'
    }
  },
  heroCode: `local groundPosition = lastGroundPosition[userId]
    or lastPosition[userId]

character:PivotTo(CFrame.new(groundPosition))
currentPosition = groundPosition`,
  games: [
    {name:'Booga Booga', creator:'Gang O’ Fries Entertainment', genre:'open-world survival', visits:266332043, favorites:530179, playing:754, upVotes:191553, downVotes:43853, placeId:11729688377, universeId:4154513353},
    {name:'Phantom Forces', creator:'StyLiS Studios', genre:'first-person shooter', visits:1797446519, favorites:5983820, playing:2192, upVotes:2462621, downVotes:250924, placeId:292439477, universeId:113491250},
    {name:'Fix It Up!', creator:'.workspace', genre:'car restoration simulator', visits:139417006, favorites:333605, playing:921, upVotes:172349, downVotes:29754, placeId:72712036210947, universeId:7673659635}
  ],
  statsChecked: '2026-09-17',
  statsSource: 'https://games.roblox.com/v1/games?universeIds=4154513353,113491250,7673659635'
};
